<script lang="ts">
  import { money, ITEMS } from "./data";
  let { subtotal, shipping, total }: { subtotal: number; shipping: number; total: number } = $props();
</script>

<ul class="mt-4 flex flex-col gap-3">
  {#each ITEMS as i (i.name)}
    <li class="flex justify-between gap-4">
      <span>
        {i.name}
        <span class="block text-sm text-ink-muted">
          {i.variant} · Qty {i.qty}
        </span>
      </span>
      <span class="tabular-nums">{money(i.qty * i.price)}</span>
    </li>
  {/each}
</ul>
<dl class="mt-4 flex flex-col gap-2 border-t border-border pt-4 tabular-nums">
  <div class="flex justify-between">
    <dt class="text-ink-muted">Subtotal</dt>
    <dd>{money(subtotal)}</dd>
  </div>
  <div class="flex justify-between">
    <dt class="text-ink-muted">Shipping</dt>
    <dd>{shipping ? money(shipping) : "Free"}</dd>
  </div>
  <div class="flex justify-between border-t border-border pt-2 text-lg font-semibold">
    <dt>Total</dt>
    <dd>{money(total)}</dd>
  </div>
  <p class="text-sm text-ink-muted">Includes {money((total / 1.19) * 0.19)} VAT</p>
</dl>
<p class="mt-4">
  <a href="#discount">Add a discount code</a>
</p>
