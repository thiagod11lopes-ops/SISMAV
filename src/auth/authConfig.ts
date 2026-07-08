/** E-mails com permissão de acesso ao sistema (sistema fechado). */
export const EMAILS_PERMITIDOS = ['hnmdtransporte@gmail.com']

export function emailTemAcesso(email: string | null | undefined): boolean {
  if (!email) return false
  const normalizado = email.trim().toLowerCase()
  return EMAILS_PERMITIDOS.some(
    (permitido) => permitido.trim().toLowerCase() === normalizado,
  )
}
