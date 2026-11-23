<script lang="ts">
  import Signup from "./Signup.svelte";
  import Welcome from "./Welcome.svelte";
  let step = $state<"signup" | "welcome">("signup");
</script>

{#if step === "signup"}<Signup onDone={() => (step = "welcome")} />{:else}<Welcome />{/if}
