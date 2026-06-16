export const COUNTRIES = Object.freeze([
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Austrália" },
  { code: "AT", name: "Áustria" },
  { code: "BR", name: "Brasil" },
  { code: "CA", name: "Canadá" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "ES", name: "Espanha" },
  { code: "US", name: "Estados Unidos" },
  { code: "FR", name: "França" },
  { code: "GE", name: "Geórgia" },
  { code: "DE", name: "Alemanha" },
  { code: "GR", name: "Grécia" },
  { code: "HU", name: "Hungria" },
  { code: "IT", name: "Itália" },
  { code: "LB", name: "Líbano" },
  { code: "MX", name: "México" },
  { code: "NZ", name: "Nova Zelândia" },
  { code: "PT", name: "Portugal" },
  { code: "ZA", name: "África do Sul" },
  { code: "UY", name: "Uruguai" },
]);

export function getCountryByCode(code) {
  return COUNTRIES.find((country) => country.code === code?.toUpperCase());
}

export function countryExists(code) {
  return COUNTRIES.some((country) => country.code === code?.toUpperCase());
}
