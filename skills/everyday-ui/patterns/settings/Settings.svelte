<script lang="ts">
  import { SECTIONS } from "./data";
  import ProfileSection from "./ProfileSection.svelte";
  import NotificationsSection from "./NotificationsSection.svelte";
  import MembersSection from "./MembersSection.svelte";
  import DangerZone from "./DangerZone.svelte";
</script>

<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-12 lg:py-20">
  <nav aria-label="Settings" class="mb-8 lg:mb-0">
    <h1 class="px-3 text-2xl font-heading">Settings</h1>
    <ul class="mt-4 flex gap-1 overflow-x-auto lg:flex-col">
      {#each SECTIONS as s, i (s)}
        <li>
          <a
            href={`#${s.toLowerCase()}`}
            aria-current={i === 0 ? "page" : undefined}
            class={[
              "flex min-h-touch items-center whitespace-nowrap rounded-control px-3 no-underline",
              i === 0 ? "bg-accent-subtle font-semibold text-accent" : "text-ink hover:bg-sunken",
            ]}
          >
            {s}
          </a>
        </li>
      {/each}
    </ul>
  </nav>

  <main class="flex max-w-2xl flex-col gap-20">
    <ProfileSection />
    <NotificationsSection />
    <MembersSection />
    <DangerZone />
  </main>
</div>
