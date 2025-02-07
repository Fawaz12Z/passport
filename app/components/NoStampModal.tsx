// --- React Methods
import React, { useContext, useState } from "react";

// --- Chakra Elements
import { Modal, ModalOverlay, ModalContent, ModalCloseButton } from "@chakra-ui/react";

// --- Shared context
import { UserContext } from "../context/userContext";

import { AdditionalSignature, fetchAdditionalSigner } from "../signer/utils";

import { AdditionalStampModal } from "./AdditionalStampModal";
import { LoadButton } from "./LoadButton";

export type NoStampModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const NoStampModal = ({ isOpen, onClose }: NoStampModalProps) => {
  // pull context in to element
  const { address } = useContext(UserContext);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [additionalSigner, setAdditionalSigner] = useState<AdditionalSignature | undefined>();

  const resetStateAndClose = () => {
    setAdditionalSigner(undefined);
    setVerificationInProgress(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetStateAndClose();
      }}
      blockScrollOnMount={false}
    >
      <ModalOverlay />
      <ModalContent>
        <div className="m-3 flex flex-col items-center">
          <ModalCloseButton
            onClick={() => {
              resetStateAndClose();
            }}
            color="rgb(var(--color-text-1))"
          />
          {additionalSigner ? (
            <AdditionalStampModal
              additionalSigner={additionalSigner}
              onClose={() => {
                resetStateAndClose();
              }}
            />
          ) : (
            <>
              <div className="mt-2 w-fit rounded-full bg-pink-500/25">
                <img className="m-2" alt="shield-exclamation-icon" src="./assets/shield-exclamation-icon-warning.svg" />
              </div>
              <p className="m-1 text-sm font-bold">You do not meet the eligibility criteria</p>
              <p className="m-1 mb-4 text-center">
                The stamp you are trying to verify could not be associated with your current Ethereum wallet address.
              </p>
              <div className="flex w-full">
                {/* <a
                  href="https://ens.domains/"
                  target="_blank"
                  className="m-1 w-1/2 items-center rounded-md border py-2  text-center"
                  rel="noreferrer"
                  onClick={() => {
                    onClose();
                  }}
                >
                  Go to ENS
                </a> */}
                <LoadButton
                  data-testid="check-other-wallet"
                  className="m-1 w-full"
                  onClick={async () => {
                    // mark as verifying
                    setVerificationInProgress(true);
                    try {
                      // fetch the credentials
                      const additionalSigner = await fetchAdditionalSigner(address!);
                      setAdditionalSigner(additionalSigner);
                    } finally {
                      // mark as done
                      setVerificationInProgress(false);
                    }
                  }}
                  isLoading={verificationInProgress}
                >
                  Try another wallet
                </LoadButton>
              </div>
            </>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
};
