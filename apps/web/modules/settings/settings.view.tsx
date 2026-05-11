"use client";

import {
  Settings01Icon,
  UserMultipleIcon,
  CustomerSupportIcon,
  Comment02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tabs, TabsContent, TabsList } from "@snappin/ui/components/tabs";
import { TextInput } from "@snappin/ui/components/input/components/textInput";
import {
  Dashboard,
  DashboardContent,
} from "../../components/layout/dashboardLayout";
import { useRouter, useSearchParams } from "next/navigation";
import { IconSvgElement } from "@hugeicons/react";
import { Card, CardContent } from "@snappin/ui/components/card";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@snappin/ui/components/button";
import { Small } from "@snappin/ui/components/typography";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { useState } from "react";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { useOrganization } from "@clerk/nextjs";
import { Label } from "@snappin/ui/components/label";
import Link from "next/link";
import { PlanSettings } from "./components/plan.settings";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@snappin/ui/components/avatar";

interface SettingsTab {
  value: string;
  label: string;
  icon: IconSvgElement;
}

const SETTINGS_TABS: SettingsTab[] = [
  { value: "general", label: "General", icon: Settings01Icon },
  { value: "team", label: "Members", icon: UserMultipleIcon },
  { value: "help", label: "Help & Support", icon: CustomerSupportIcon },
];

interface SettingsTabTriggerProps {
  tab: SettingsTab;
  isActive: boolean;
  onClick: (tab: SettingsTab) => void;
}

const SettingsTabTrigger = ({
  tab,
  isActive,
  onClick,
}: SettingsTabTriggerProps) => (
  <button
    onClick={() => onClick(tab)}
    className={`
      flex items-center gap-1.5 w-full rounded-md px-2.5 text-sm font-medium py-2 transition-colors text-left
      ${isActive ? "text-fg-4 bg-accent" : "text-fg-2"}
    `}
  >
    <HugeiconsIcon
      strokeWidth={2.5}
      className="size-4 shrink-0"
      icon={tab.icon}
    />
    {tab.label}
  </button>
);

export const SettingsView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isRemovingMember, setIsRemovingMember] = useState<boolean>(false);

  const openConfirm = useConfirmStore((s) => s.openConfirm);

  // Derive active tab from the current URL
  const activeTab = searchParams.get("tab") ?? "general";

  const { organization, memberships, membership, invitations } =
    useOrganization({
      memberships: { infinite: true },
      invitations: { infinite: true },
    });
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isCancellingInvite, setIsCancellingInvite] = useState<string | null>(
    null,
  ); // store inviteId being cancelled

  const handleCancelInvite = async (invitationId: string) => {
    const invitation = invitations?.data?.find(
      (inv) => inv.id === invitationId,
    );
    if (!invitation) return;
    setIsCancellingInvite(invitationId);
    try {
      await invitation.revoke();
      toast.success("Invite cancelled");
      void invitations?.revalidate?.();
    } catch {
      toast.error("Failed to cancel invite");
    } finally {
      setIsCancellingInvite(null);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail || !organization) return;
    setIsInviting(true);
    try {
      await organization.inviteMember({
        emailAddress: inviteEmail,
        role: "org:guest",
      });
      void invitations?.revalidate?.();

      toast.success(`Invite sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (err) {
      const clerkError = err as { errors?: { message: string }[] };
      toast.error(clerkError?.errors?.[0]?.message ?? "Failed to send invite");
    } finally {
      setIsInviting(false);
    }
  };

  const handleTabClick = (tab: SettingsTab) => {
    router.push(`/settings?tab=${tab.value}`);
  };

  const deleteUser = trpc.user.deleteUser.useMutation({
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      await signOut();
      router.push("/signup");
    },
    onError: () => {
      toast.error("Failed to delete your account");
    },
  });

  const removeMember = trpc.organization.removeMember.useMutation({
    onSuccess: () => {
      toast.success("Member removed successfully");
      void memberships?.revalidate?.();
      setIsRemovingMember(false);
    },
    onError: () => {
      toast.error("Failed to remove member");
      setIsRemovingMember(false);
    },
  });

  return (
    <Dashboard>
      <DashboardContent className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-0 min-h-[80vh]">
            <Tabs
              value={activeTab}
              className="flex rounded-none min-h-full w-full"
            >
              <TabsList className="flex flex-col p-5 min-h-[80vh] max-w-50 w-full border-r border-bg-3 rounded-none items-start bg-transparent gap-1">
                {SETTINGS_TABS.map((tab) => (
                  <SettingsTabTrigger
                    key={tab.value}
                    tab={tab}
                    isActive={activeTab === tab.value}
                    onClick={handleTabClick}
                  />
                ))}
              </TabsList>

              <div className="w-full min-h-full px-6 py-0 pb-2">
                <TabsContent value="general" className="w-full">
                  <div className="w-full space-y-1 border-b border-bg-3 py-4">
                    <Label>Account</Label>
                    <Small>
                      {user?.emailAddresses[0]?.emailAddress ??
                        "Account email"}
                    </Small>
                  </div>
                  <PlanSettings />
                  <div className="w-full py-4 space-y-2">
                    <div className="space-y-1">
                      <Label>Delete Account</Label>
                      <Small>
                        Permanently delete your account and all associated
                        documents. This action is practically immediate, and
                        cannot be undone.
                      </Small>
                    </div>
                    <Button
                      variant={"link"}
                      className="p-0 text-start justify-start text-destructive/50 group hover:text-destructive"
                      disabled={isDeleting}
                      onClick={() =>
                        openConfirm({
                          title: "Delete account",
                          description:
                            "Are you sure that you want to delete your account?",
                          confirmLabel: "Delete permanently",
                          destructive: true,
                          size: "sm",
                          onConfirm: () => {
                            setIsDeleting(true);
                            deleteUser.mutate({ userId: user?.id ?? "" });
                          },
                        })
                      }
                    >
                      {isDeleting && (
                        <Spinner className="text-destructive/50 group-hover:text-destructive" />
                      )}
                      Delete
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="team" className="w-full">
                  {membership?.role == "org:admin" ? (
                    <>
                      <div className="min-w-full border-b border-bg-3 py-4 space-y-1">
                        <Label>Invite Member</Label>
                        <Small>
                          Invite a teammate to join your organization.
                        </Small>
                        <div className="flex gap-2 mt-4 items-center">
                          <TextInput
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e)}
                            placeholder="teammate@company.com"
                            inputWrapperClassName="border-bg-3! min-h-10"
                          />

                          <Button
                            variant="mono"
                            disabled={isInviting || !inviteEmail}
                            onClick={handleInvite}
                          >
                            {isInviting && <Spinner className="size-4" />}
                            Send Invite
                          </Button>
                        </div>
                      </div>

                      {/* Existing members list */}
                      <div className="w-full py-4 space-y-1">
                        <Label>Members</Label>
                        <Small>View and manage your organization members</Small>
                        <div className="mt-4">
                          {memberships?.data?.map((m) => (
                            <div
                              key={m.id}
                              className="flex items-center justify-between py-2 border-b border-bg-3 last:border-0"
                            >
                              <div className="flex gap-2 items-center">
                                <Avatar className="size-8">
                                  <AvatarImage
                                    src={m.publicUserData?.imageUrl}
                                  />
                                  <AvatarFallback>
                                    {m.publicUserData?.identifier?.slice(0, 1)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-fg-4">
                                    {m.publicUserData?.identifier.split("@")[0]}
                                  </span>
                                  <span className="text-xs text-fg-2">
                                    {m.publicUserData?.identifier}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Small className="text-fg-2 capitalize">
                                  {m.role.replace("org:", "")}
                                </Small>
                                {m.role !== "org:admin" && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    disabled={removeMember.isPending}
                                    onClick={() =>
                                      openConfirm({
                                        title: "Remove member",
                                        description: `Are you sure you want to remove ${m.publicUserData?.identifier} from the organization?`,
                                        confirmLabel: "Remove",
                                        destructive: true,
                                        size: "sm",
                                        onConfirm: () => {
                                          setIsRemovingMember(true);
                                          removeMember.mutate({
                                            userId:
                                              m.publicUserData?.userId ?? "",
                                          });
                                        },
                                      })
                                    }
                                  >
                                    {isRemovingMember ? (
                                      <Spinner className="text-white" />
                                    ) : (
                                      "Remove"
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ✅ Pending invitations list */}
                      {invitations?.data && invitations.data.length > 0 && (
                        <div className="w-full py-4 space-y-1 border-t border-bg-3">
                          <Label>Pending Invites</Label>
                          <Small>
                            Invitations that have been sent but not yet accepted
                          </Small>
                          <div className="mt-4">
                            {invitations.data.map((inv) => (
                              <div
                                key={inv.id}
                                className="flex items-center justify-between py-2 border-b border-bg-3 last:border-0"
                              >
                                <div className="flex gap-2 items-center">
                                  <Avatar className="size-8">
                                    <AvatarFallback className="bg-green-4">
                                      {inv.emailAddress
                                        ?.slice(0, 1)
                                        .toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-fg-4">
                                      {inv.emailAddress}
                                    </span>
                                    <span className="text-xs text-fg-2 capitalize">
                                      Invited as {inv.role.replace("org:", "")}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={isCancellingInvite === inv.id}
                                    onClick={() =>
                                      openConfirm({
                                        title: "Cancel invite",
                                        description: `Cancel the invite sent to ${inv.emailAddress}?`,
                                        confirmLabel: "Cancel invite",
                                        destructive: true,
                                        size: "sm",
                                        onConfirm: () =>
                                          handleCancelInvite(inv.id),
                                      })
                                    }
                                  >
                                    {isCancellingInvite === inv.id ? (
                                      <Spinner className="size-4" />
                                    ) : (
                                      "Cancel"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center mt-12">
                      <h6 className="font-semibold">No Access</h6>
                      <Small>You don&#39;t have permission</Small>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="help">
                  <Card className="bg-bg-2 my-2 mt-4 shadow-none">
                    <CardContent>
                      <HugeiconsIcon
                        icon={Comment02Icon}
                        className="size-7 text-gray-4"
                      />
                      <Small className="mt-2 mb-1 text-fg-4">Seek help</Small>
                      <Small>To get support from our team</Small>
                      <Small className="mt-4">
                        → Email:{" "}
                        <span className="underline font-medium text-fg-4">
                          support@snappinapp.com
                        </span>
                      </Small>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex gap-4 text-sm font-normal text-fg-2 mt-6 mx-auto w-fit">
          <Link
            href="https://www.producthunt.com/products/snappin-app"
            target="_blank"
          >
            About Snappin
          </Link>
          <Link
            href="https://www.producthunt.com/products/snappin-app"
            target="_blank"
          >
            Rate us
          </Link>
        </div>
      </DashboardContent>
    </Dashboard>
  );
};
