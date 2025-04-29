"use client"; // Mark as Client Component

import * as React from "react";
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
   Tooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from "@/components/ui/tooltip";

// Import the server actions
import { approveClaim, rejectClaim } from "@/lib/actions/coordinator.actions";

interface ClaimActionButtonsClientProps {
    claimId: string;
    centerId: string;
    coordinatorId: string; // Pass coordinator ID for the action payload
}

export function ClaimActionButtonsClient({ claimId, centerId, coordinatorId }: ClaimActionButtonsClientProps) {
    const router = useRouter();
    const [isApproving, setIsApproving] = React.useState(false);
    const [isRejecting, setIsRejecting] = React.useState(false);
    const isLoading = isApproving || isRejecting;

    const handleApprove = async () => {
        setIsApproving(true);
        try {
            const result = await approveClaim({ claimId, centerId, coordinatorId });
            if (result.success) {
                toast.success(result.message || "Claim approved.");
                router.refresh(); // Refresh data on the page
            } else {
                toast.error(result.message || "Failed to approve claim.");
            }
        } catch (e) {
            console.error("Approve claim client error:", e);
            toast.error("An unexpected error occurred while approving.");
        } finally {
            setIsApproving(false);
        }
    };

    const handleReject = async () => {
        setIsRejecting(true);
         try {
            const result = await rejectClaim({ claimId, centerId, coordinatorId });
            if (result.success) {
                toast.success(result.message || "Claim rejected.");
                router.refresh(); // Refresh data on the page
            } else {
                toast.error(result.message || "Failed to reject claim.");
            }
        } catch (e) {
            console.error("Reject claim client error:", e);
            toast.error("An unexpected error occurred while rejecting.");
        } finally {
            setIsRejecting(false);
        }
    };

    return (
        <div className="flex items-center justify-end space-x-2">
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button
                            variant="outline"
                            size="sm" // Use sm for consistency with other buttons potentially
                            className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={handleApprove}
                            disabled={isLoading}
                            aria-label="Approve Claim"
                        >
                            {isApproving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                            Approve
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent> <p>Approve this claim</p> </TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                         <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={handleReject}
                            disabled={isLoading}
                            aria-label="Reject Claim"
                        >
                             {isRejecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                             Reject
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent> <p>Reject this claim</p> </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
