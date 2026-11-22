<script>
  let busy = $state(false);
</script>
<form>
  <button disabled={busy}>Send</button>
  <button class="icon"><svg viewBox="0 0 1 1"></svg></button>
</form>
<style>
  .icon { padding: 10px; font-weight: bold; }
</style>
