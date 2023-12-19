const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL


// agents bucket 
export const agentsBucketUrl = `${supabaseUrl}/storage/v1/object/public/agents/`

// galleries bucket
export const galleriesBucketUrl = `${supabaseUrl}/storage/v1/object/public/galleries/`

// cars bucket
export const carsBucketUrl = `${supabaseUrl}/storage/v1/object/public/cars/`

// assets bucket 
export const assetsBucketUrl = `${supabaseUrl}/storage/v1/object/public/assets/`