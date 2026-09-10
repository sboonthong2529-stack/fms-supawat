import "server-only";

export {
  listEdocTemplates,
  submitEdocRequest,
  trackEdocRequest,
  listAdminEdocRequests,
  reviewEdocRequest,
  type EdocTemplateDto,
  type EdocRequestDto,
} from "./_internal/services";
export { EDOCS_P, EDOCS_PERMISSIONS } from "./permissions";
