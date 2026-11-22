export const PRODUCT = "Atlas";

export const PASSWORD_RULES = (email: string) => [
  { label: "At least 12 characters", test: (v: string) => v.length >= 12 },
  { label: "Not the same as your email address", test: (v: string) => v.length > 0 && v.toLowerCase() !== email.toLowerCase() },
];

export const SETUP = [
  { id: "account", label: "Create your account", done: true },
  { id: "project", label: "Create your first project", done: false },
  { id: "invite", label: "Invite your team", done: false, optional: true },
  { id: "bank", label: "Connect your bank account", done: false, optional: true },
];
