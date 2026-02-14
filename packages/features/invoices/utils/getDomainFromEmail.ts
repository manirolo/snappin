export function getDomainFromEmail(email: string): string | undefined {
    if (!email) return;

    const atIndex = email.lastIndexOf("@");
    if (atIndex === -1) return;

    return email.slice(atIndex + 1).toLowerCase();
}
