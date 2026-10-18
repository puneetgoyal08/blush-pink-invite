import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InvitationOpener } from "./invitation-opener";

describe("InvitationOpener", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens the invitation after the split-veil animation", () => {
    vi.useFakeTimers();
    const onOpened = vi.fn();
    render(<InvitationOpener onOpened={onOpened} />);

    fireEvent.click(
      screen.getByRole("button", { name: "Open Nidhi & Puneet's wedding invitation" }),
    );

    expect(onOpened).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveClass("is-opening");
    act(() => vi.advanceTimersByTime(1250));
    expect(onOpened).toHaveBeenCalledOnce();
  });

  it("lets guests skip the opening animation immediately", () => {
    const onOpened = vi.fn();
    render(<InvitationOpener onOpened={onOpened} />);

    fireEvent.click(screen.getByRole("button", { name: "Skip to the invitation" }));

    expect(onOpened).toHaveBeenCalledOnce();
  });

  it("closes the opener immediately when Escape is pressed", () => {
    const onOpened = vi.fn();
    render(<InvitationOpener onOpened={onOpened} />);

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onOpened).toHaveBeenCalledOnce();
  });
});
