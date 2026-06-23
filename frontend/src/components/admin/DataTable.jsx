export default function DataTable({ columns, data, onEdit, onDelete, actions = false }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur">
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/80">
          <tr>
            {columns.map(col => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {col.label}
              </th>
            ))}
            {actions && <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/70">
          {data.map(row => (
            <tr key={row.id} className="transition-colors hover:bg-zinc-800/40">
              {columns.map(col => (
                <td key={col.key} className="whitespace-nowrap px-4 py-3 text-zinc-300">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex gap-3">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="cursor-pointer border-none bg-transparent text-sm font-medium text-sky-400 hover:text-sky-300 hover:underline">
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row.id)} className="cursor-pointer border-none bg-transparent text-sm font-medium text-red-400 hover:text-red-300 hover:underline">
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="py-8 text-center text-zinc-500">No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
