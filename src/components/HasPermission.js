'use client';

import { usePermissions } from '../hooks/usePermissions';

function HasPermission({ permission, children }) {
  const permisos = usePermissions();

  if (!permisos.includes(permission)) {
    return null; // No renderiza nada si no tiene el permiso
  }

  return <>{children}</>;
}

export default HasPermission;
