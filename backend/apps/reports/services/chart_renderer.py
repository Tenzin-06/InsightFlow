import html
from pathlib import Path

from apps.reports.services.asset_manager import build_asset_path, relative_media_path


def render_report_charts(report_id: int, analytics_payload: dict, ai_payload: dict) -> dict:
    assets = {}
    charts = analytics_payload.get("charts", {})

    response_trend = charts.get("response_trend", [])
    if response_trend:
        assets["response_trend"] = _render_bar_chart(
            report_id,
            "Response Trend",
            [str(item.get("date", "")) for item in response_trend],
            [float(item.get("responses", item.get("value", 0)) or 0) for item in response_trend],
        )

    question_engagement = charts.get("question_engagement", [])
    if question_engagement:
        assets["question_engagement"] = _render_bar_chart(
            report_id,
            "Question Engagement",
            [f"Q{idx + 1}" for idx, _ in enumerate(question_engagement[:12])],
            [float(item.get("answer_count", 0) or 0) for item in question_engagement[:12]],
        )

    sentiment = ai_payload.get("sentiment", {}).get("distribution", {})
    if sentiment:
        assets["sentiment"] = _render_bar_chart(
            report_id,
            "Sentiment Distribution",
            list(sentiment.keys()),
            [float(value or 0) for value in sentiment.values()],
        )

    return assets


def _render_bar_chart(report_id: int, title: str, labels: list[str], values: list[float]) -> dict:
    try:
        return _render_matplotlib_chart(report_id, title, labels, values)
    except Exception:
        return _render_svg_chart(report_id, title, labels, values)


def _render_matplotlib_chart(report_id: int, title: str, labels: list[str], values: list[float]) -> dict:
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    path = build_asset_path(report_id, ".png")
    fig, ax = plt.subplots(figsize=(8, 3.6), dpi=160)
    ax.bar(labels, values, color="#3B82F6")
    ax.set_title(title)
    ax.grid(axis="y", color="#E2E8F0", linewidth=0.8)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    fig.tight_layout()
    fig.savefig(path, format="png")
    plt.close(fig)
    return {"path": str(path), "media_path": relative_media_path(path), "type": "png", "title": title}


def _render_svg_chart(report_id: int, title: str, labels: list[str], values: list[float]) -> dict:
    path = build_asset_path(report_id, ".svg")
    width = 900
    height = 360
    margin = 60
    max_value = max(values) if values else 1
    bar_width = max(18, int((width - margin * 2) / max(len(values), 1) * 0.6))
    gap = max(8, int((width - margin * 2) / max(len(values), 1) * 0.4))
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">',
        '<rect width="100%" height="100%" fill="#FFFFFF"/>',
        f'<text x="{margin}" y="34" font-family="Arial" font-size="22" font-weight="700" fill="#0F172A">{html.escape(title)}</text>',
    ]
    baseline = height - margin
    for index, value in enumerate(values):
        bar_height = int((value / max_value) * (height - margin * 2)) if max_value else 0
        x = margin + index * (bar_width + gap)
        y = baseline - bar_height
        label = labels[index][:12]
        parts.append(f'<rect x="{x}" y="{y}" width="{bar_width}" height="{bar_height}" rx="4" fill="#3B82F6"/>')
        parts.append(f'<text x="{x}" y="{baseline + 22}" font-family="Arial" font-size="12" fill="#475569">{html.escape(label)}</text>')
    parts.append("</svg>")
    Path(path).write_text("".join(parts), encoding="utf-8")
    return {"path": str(path), "media_path": relative_media_path(path), "type": "svg", "title": title}

