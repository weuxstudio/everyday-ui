import { mount } from "svelte";
import Contract from "./Contract.svelte";
import Signup from "./signup/SignupOnboarding.svelte";

mount(location.search ? Contract : Signup, { target: document.querySelector("#app")! });
