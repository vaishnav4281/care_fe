import { useState } from "react";
import { useTranslation } from "react-i18next";

import CareIcon from "@/CAREUI/icons/CareIcon";

import { ButtonSize } from "@/components/Common/ButtonV2";
import DropdownMenu, { DropdownItem } from "@/components/Common/Menu";
import {
  ConditionVerificationStatus,
  InactiveConditionVerificationStatuses,
} from "@/components/Diagnosis/types";

import { classNames } from "@/Utils/utils";

interface Props<T extends ConditionVerificationStatus> {
  disabled?: boolean;
  value?: T;
  defaultValue?: T; // Added default value support
  placeholder?: string;
  options: readonly T[];
  onSelect: (option: T) => void;
  onRemove?: () => void;
  className?: string;
  size?: ButtonSize;
}

export default function ConditionVerificationStatusMenu<
  T extends ConditionVerificationStatus,
>(props: Props<T>) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedValue, setSelectedValue] = useState(props.defaultValue);

  const filteredOptions = props.options.filter((status) =>
    t(status).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DropdownMenu
      size={props.size ?? "small"}
      className={classNames(
        props.className,
        selectedValue && StatusStyle[selectedValue].colors,
        selectedValue &&
          "border !border-secondary-400 bg-white hover:bg-secondary-300",
      )}
      id="condition-verification-status-menu"
      title={
        selectedValue
          ? t(selectedValue)
          : props.placeholder ?? t("add_as")
      }
      disabled={props.disabled}
      variant={selectedValue ? StatusStyle[selectedValue].variant : "primary"}
    >
      <>
        <input
          type="text"
          placeholder={t("search")}
          className="p-2 w-full border-b"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredOptions.map((status) => (
          <DropdownItem
            key={status}
            id={`add-icd11-diagnosis-as-${status}`}
            variant={StatusStyle[status].variant}
            onClick={() => {
              setSelectedValue(status);
              props.onSelect(status);
            }}
            icon={
              <CareIcon
                icon="l-coronavirus"
                className={classNames(
                  "hidden text-lg transition-all duration-200 ease-in-out group-hover:rotate-90 group-hover:text-inherit md:block",
                  selectedValue === status
                    ? "text-inherit-500"
                    : "text-secondary-500",
                )}
              />
            }
            className="group"
            disabled={selectedValue === status}
          >
            <div className="flex w-full max-w-xs flex-col items-start gap-1 whitespace-nowrap md:whitespace-normal">
              <span className={selectedValue === status ? "font-medium" : ""}>
                {InactiveConditionVerificationStatuses.includes(
                  status as (typeof InactiveConditionVerificationStatuses)[number],
                )
                  ? t("remove_as")
                  : ""}
                {t(status)}
              </span>
              <span className="hidden text-xs text-secondary-600 md:block">
                {t(`help_${status}`)}
              </span>
            </div>
          </DropdownItem>
        ))}

        {selectedValue && props.onRemove && (
          <DropdownItem
            variant="danger"
            id="remove-diagnosis"
            onClick={() => {
              setSelectedValue(undefined);
              props.onRemove?.();
            }}
            icon={<CareIcon icon="l-trash-alt" className="text-lg" />}
          >
            {t("remove")}
          </DropdownItem>
        )}
      </>
    </DropdownMenu>
  );
}

export const StatusStyle = {
  unconfirmed: {
    variant: "warning",
    colors: "text-yellow-500 border-yellow-500",
  },
  provisional: {
    variant: "warning",
    colors: "text-secondary-800 border-secondary-800",
  },
  differential: {
    variant: "warning",
    colors: "text-secondary-800 border-secondary-800",
  },
  confirmed: {
    variant: "primary",
    colors: "text-primary-500 border-primary-500",
  },
  refuted: {
    variant: "danger",
    icon: "l-times",
    colors: "text-danger-500 border-danger-500",
  },
  "entered-in-error": {
    variant: "danger",
    colors: "text-danger-500 border-danger-500",
  },
} as const;
