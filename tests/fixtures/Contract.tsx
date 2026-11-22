import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Badge, BottomSheet, Button, Card, FieldError, FieldHint, RequirementMark, Stepper } from "@everyday-ui/react";
import { AnimatedList, Collapse, MotionProvider, Reveal, useViewTransition } from "@everyday-ui/react/motion";
import Signup from "./signup/SignupOnboarding";

function Contract() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [items, setItems] = useState(["One"]);
  const [duration, setDuration] = useState("160ms");
  const transition = useViewTransition();
  return <main>
    <h1>Component contract</h1>
    <Card title="Order" description="Current order"><Badge tone="success">Paid</Badge>
      <Stepper label="Quantity" hint="Up to two" min={0} max={2} />
    </Card>
    <FieldHint id="hint">Delivery hint</FieldHint><FieldError id="error">Delivery error</FieldError>
    <RequirementMark optional />
    <Button onClick={() => setOpen(true)}>Open sheet</Button>
    <BottomSheet open={open} title="Options" onClose={() => setOpen(false)} />
    <MotionProvider style={{ "--eu-duration-base": duration } as React.CSSProperties}>
      <Button onClick={() => setDuration("80ms")}>Change theme</Button>
      <Button onClick={() => transition(() => setDetails(!details))}>Toggle details</Button>
      <Reveal show={details}>Delivery information</Reveal>
      <Collapse open={details}>Shipping details</Collapse>
      <Button onClick={() => setItems(items.length === 1 ? ["Two", "One"] : ["One"])}>Change items</Button>
      <AnimatedList items={items} getKey={(item) => item} renderItem={(item) => item} />
    </MotionProvider>
  </main>;
}

createRoot(document.querySelector("#app")!).render(location.search ? <Contract /> : <Signup />);
