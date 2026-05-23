from django.db import transaction

from apps.campaigns.models.recipient import Recipient
from apps.campaigns.services.validation_service import normalize_contact


def process_bulk_upload(audience, contacts: list[dict]) -> dict:
    """
    Validate, deduplicate, and bulk-insert recipients for an audience.

    Workflow:
      1. Normalize + validate each row (email format, required fields).
      2. Detect duplicates within the upload batch.
      3. Detect existing recipients in the audience to skip.
      4. bulk_create valid, non-duplicate rows inside a single transaction.

    Returns a summary dict:
      {
        "uploaded":   <int>,  # rows newly inserted
        "duplicates": <int>,  # rows skipped (already in audience)
        "invalid":    <int>,  # rows rejected (bad format / missing email)
      }
    """
    valid_rows: list[dict] = []
    invalid_count: int = 0
    seen_in_batch: set[str] = set()

    # --- Step 1 & 2: validate + deduplicate within batch ---
    for row in contacts:
        normalized, error = normalize_contact(row)
        if error:
            invalid_count += 1
            continue

        email = normalized["email"]
        if email in seen_in_batch:
            # duplicate inside this upload → count as invalid so the caller
            # knows something was skipped
            invalid_count += 1
            continue

        seen_in_batch.add(email)
        valid_rows.append(normalized)

    if not valid_rows:
        return {"uploaded": 0, "duplicates": 0, "invalid": invalid_count}

    # --- Step 3: find emails already stored for this audience ---
    candidate_emails = [row["email"] for row in valid_rows]
    existing_emails: set[str] = set(
        Recipient.objects.filter(
            audience=audience,
            email__in=candidate_emails,
        ).values_list("email", flat=True)
    )

    to_create: list[Recipient] = []
    duplicate_count: int = 0

    for row in valid_rows:
        if row["email"] in existing_emails:
            duplicate_count += 1
        else:
            to_create.append(
                Recipient(
                    audience=audience,
                    email=row["email"],
                    first_name=row.get("first_name", ""),
                    last_name=row.get("last_name", ""),
                )
            )

    # --- Step 4: bulk insert inside a single transaction ---
    with transaction.atomic():
        Recipient.objects.bulk_create(
            to_create,
            ignore_conflicts=True,  # safety-net for concurrent uploads
        )

    return {
        "uploaded": len(to_create),
        "duplicates": duplicate_count,
        "invalid": invalid_count,
    }
