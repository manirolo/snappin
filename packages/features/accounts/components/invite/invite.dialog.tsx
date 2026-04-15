import DialogContent, {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogLabel,
  DialogTitle,
  DialogTrigger,
} from "@snappin/ui/components/dialog";
import React, { useState } from "react";
import { UserAdd01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@snappin/ui/components/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@snappin/ui/components/tabs";
import { TextInput } from "@snappin/ui/components/input/components/textInput";
import { Small } from "@snappin/ui/components/typography";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { useOrganization } from "@clerk/nextjs";
import toast from "react-hot-toast";

export const InviteDialog = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const { organization } = useOrganization();

  const handleInvite = async (role: "org:admin" | "org:guest") => {
    if (!email || !organization) return;
    setIsInviting(true);
    try {
      await organization.inviteMember({ emailAddress: email, role });
      toast.success(`Invite sent to ${email}`);
      setEmail("");
      setOpen(false);
    } catch (err) {
      const clerkError = err as { errors?: { message: string }[] };
      toast.error(clerkError?.errors?.[0]?.message ?? "Failed to send invite");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <HugeiconsIcon icon={UserAdd01Icon} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogLabel>Invite</DialogLabel>
          <DialogTitle>Invite member or accountant</DialogTitle>
          <DialogDescription>
            Send an invite link to your team or accountant
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 py-6 space-y-4">
          <Tabs defaultValue="member">
            <TabsList className="w-fit mb-6 mx-auto">
              <TabsTrigger value="member">Team Member</TabsTrigger>
              <TabsTrigger value="accountant">Accountant</TabsTrigger>
            </TabsList>

            <TabsContent value="member" className="space-y-3">
              <Small className="text-fg-2">
                Team members will be invited as <span className="text-fg-4 font-medium">Member</span> — they can view and manage invoices.
              </Small>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e)}
                placeholder="teammate@company.com"
                inputWrapperClassName="border-bg-3! min-h-10"
              />
              <Button
                variant="mono"
                className="w-full"
                disabled={isInviting || !email}
                onClick={() => handleInvite("org:guest")}
              >
                {isInviting && <Spinner className="size-4" />}
                Send Invite as Member
              </Button>
            </TabsContent>

            <TabsContent value="accountant" className="mt-4 space-y-3">
              <Small className="text-fg-2">
                Accountants will be invited as <span className="text-fg-4 font-medium">Admin</span> — they'll have full access to manage your finances.
              </Small>
              <TextInput
                value={email}
                onChange={(e) => setEmail(e)}
                placeholder="accountant@firm.com"
                inputWrapperClassName="border-bg-3! min-h-10"
              />
              <Button
                variant="mono"
                className="w-full"
                disabled={isInviting || !email}
                onClick={() => handleInvite("org:admin")}
              >
                {isInviting && <Spinner className="size-4" />}
                Send Invite as Accountant
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};