<script lang="ts">
  import { money, MONTHS } from "./data";
  const max = $derived(Math.max(...MONTHS.map(([, v]) => v)));
  const W = 560;
  const H = 220;
  const pad = 28;
  const bw = 56;
  const gap = $derived((W - pad * 2 - bw * MONTHS.length) / (MONTHS.length - 1));
</script>

<figure class="m-0 rounded-card border border-border bg-surface p-card">
  <figcaption>
    <h2 class="text-lg font-heading">Revenue by month</h2>
    <p class="text-sm text-ink-muted">Growing for three months in a row; November is the best month this year.</p>
  </figcaption>
  <svg viewBox={`0 0 ${W} ${H + 40}`} class="mt-4 w-full" role="img" aria-labelledby="chart-desc">
    <desc id="chart-desc">Bar chart of monthly revenue from June to November; values in the table below.</desc>
    <line x1={pad} x2={W - pad} y1={H} y2={H} stroke="var(--eu-color-border-strong)"></line>
    {#each MONTHS as [m, v], i (m)}
      {@const h = (v / max) * (H - 36)}
      {@const x = pad + i * (bw + gap)}
      {@const current = i === MONTHS.length - 1}<g>
        <rect
          {x}
          y={H - h}
          width={bw}
          height={h}
          rx="4"
          fill={current ? "var(--eu-color-accent)" : "var(--eu-color-border-strong)"}
        ></rect>
        <text
          x={x + bw / 2}
          y={H - h - 8}
          text-anchor="middle"
          font-size="13"
          font-weight={current ? 600 : 400}
          fill="var(--eu-color-ink)"
        >
          {money(v, true)}
        </text>
        <text x={x + bw / 2} y={H + 22} text-anchor="middle" font-size="13" fill="var(--eu-color-ink-muted)">
          {m}
        </text>
      </g>
    {/each}
  </svg>
  <table class="sr-only">
    <caption>Revenue by month</caption>
    <tbody>
      {#each MONTHS as [m, v] (m)}
        <tr>
          <th scope="row">{m}</th>
          <td>{money(v)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</figure>
