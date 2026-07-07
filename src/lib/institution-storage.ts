const INSTITUTION_NAME_KEY = "wutuo_institution_name";
const INSTITUTION_LOGO_KEY = "wutuo_institution_logo";

export function loadInstitutionName(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(INSTITUTION_NAME_KEY) ?? "";
}

export function loadInstitutionLogo(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(INSTITUTION_LOGO_KEY);
}

export function saveInstitutionName(name: string) {
  if (typeof window === "undefined") return;
  if (name.trim()) {
    localStorage.setItem(INSTITUTION_NAME_KEY, name.trim());
  } else {
    localStorage.removeItem(INSTITUTION_NAME_KEY);
  }
}

export function saveInstitutionLogo(logo: string | null) {
  if (typeof window === "undefined") return;
  if (logo) {
    localStorage.setItem(INSTITUTION_LOGO_KEY, logo);
  } else {
    localStorage.removeItem(INSTITUTION_LOGO_KEY);
  }
}
