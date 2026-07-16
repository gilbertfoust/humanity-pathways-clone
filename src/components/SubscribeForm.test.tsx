import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SubscribeForm from "@/components/SubscribeForm";

const invokeMock = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: (...args: unknown[]) => invokeMock(...args) },
  },
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe("SubscribeForm", () => {
  beforeEach(() => {
    invokeMock.mockReset();
  });

  it("submits successfully and clears input on 200 with success", async () => {
    invokeMock.mockResolvedValueOnce({
      data: { success: true, referenceId: "HPG-N-TEST01" },
      error: null,
    });
    render(<SubscribeForm />);
    const input = screen.getByPlaceholderText("Email") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "hello@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(invokeMock).toHaveBeenCalledWith(
        "submit-newsletter",
        expect.objectContaining({
          body: expect.objectContaining({ email: "hello@example.com" }),
        })
      );
    });
    await waitFor(() => expect(input.value).toBe(""));
  });

  it("shows an error banner when the edge function returns an error", async () => {
    invokeMock.mockResolvedValueOnce({
      data: { success: false, error: "Too many attempts." },
      error: null,
    });
    render(<SubscribeForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "hello@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain("Too many attempts.");
  });

  it("rejects invalid email locally without calling the function", async () => {
    render(<SubscribeForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));
    const alert = await screen.findByRole("alert");
    expect(alert.textContent?.toLowerCase()).toContain("valid email");
    expect(invokeMock).not.toHaveBeenCalled();
  });
});
