<script lang="ts">
  import {
    Badge,
    BottomSheet,
    Button,
    Card,
    FieldError,
    FieldHint,
    RequirementMark,
    Stepper,
  } from "@everyday-ui/svelte";
  import { AnimatedList, Collapse, MotionProvider, Reveal, viewTransition } from "@everyday-ui/svelte/motion";
  let open = $state(false);
  let details = $state(false);
  let items = $state(["One"]);
  let duration = $state("160ms");
</script>

<main>
  <h1>Component contract</h1>
  <Card title="Order" description="Current order">
    <Badge tone="success">Paid</Badge>
    <Stepper label="Quantity" hint="Up to two" min={0} max={2} />
  </Card>
  <FieldHint id="hint" content="Delivery hint" /><FieldError id="error" content="Delivery error" />
  <RequirementMark optional />
  <Button onclick={() => (open = true)}>Open sheet</Button>
  <BottomSheet bind:open title="Options" />
  <MotionProvider style={"--eu-duration-base: " + duration}>
    <Button onclick={() => (duration = "80ms")}>Change theme</Button>
    <Button onclick={() => viewTransition(() => (details = !details))}>Toggle details</Button>
    <Reveal show={details}>Delivery information</Reveal>
    <Collapse open={details}>Shipping details</Collapse>
    <Button onclick={() => (items = items.length === 1 ? ["Two", "One"] : ["One"])}>Change items</Button>
    <AnimatedList {items} getKey={(item) => item}>
      {#snippet renderItem(item)}{item}{/snippet}
    </AnimatedList>
  </MotionProvider>
</main>
