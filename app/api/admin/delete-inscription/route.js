import { createClient } from '@supabase/supabase-js'

export async function DELETE(req) {
  const { id } = await req.json()

  if (!id) {
    return Response.json({ error: 'id manquant' }, { status: 400 })
  }

  // La service role key bypass les RLS policies — à utiliser côté serveur uniquement
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { error } = await supabase
    .from('inscriptions')
    .delete()
    .eq('id', id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ ok: true })
}
