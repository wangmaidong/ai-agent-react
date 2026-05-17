import type { iCreateDefaultColumnConfig } from "./AutoColumn.utils.tsx";
import { installColumnInput } from "./col.input.tsx";
import { installColumnSelect } from "./col.select.tsx";
import { installColumnToggle } from "./col.toggle.tsx";
import { installColumnOperation } from "../AutoTable/standard/operation/col.operate.tsx";

export const CreateDefaultColumnConfig: iCreateDefaultColumnConfig = {} as any;

installColumnInput();
installColumnSelect();
installColumnToggle();
installColumnOperation();
