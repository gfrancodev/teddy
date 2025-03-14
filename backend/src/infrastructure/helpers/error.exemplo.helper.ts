export function errorExemplo(
  status: number,
  code: number,
  description: string,
  name: string,
  path: string,
  details?: Record<string, any>,
) {
  return {
    success: false,
    error: {
      id: '4920d8a1-f099-4cd8-b707-11f197f2b76c',
      status: status,
      name: name,
      details: {
        timestamp: '2025-03-12T23:40:21.864Z',
        path: path,
        code: code,
        description: description,
      },
      ...details,
    },
  };
}
