-- Fix the files policies with correct column name
DROP POLICY IF EXISTS "Users can manage their own files" ON public.files;

CREATE POLICY "Users can manage their own files" 
ON public.files 
FOR ALL 
USING (uploadedby = auth.uid());

-- Create missing tables that might be referenced
DO $$ 
BEGIN
    -- Create user_preferences table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_preferences') THEN
        CREATE TABLE public.user_preferences (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
            preferences jsonb DEFAULT '{}',
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now()
        );
        ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Create document_permissions table if it doesn't exist
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'document_permissions') THEN
        CREATE TABLE public.document_permissions (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
            user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
            permission_type text NOT NULL CHECK (permission_type IN ('read', 'write', 'admin')),
            granted_at timestamp with time zone DEFAULT now(),
            granted_by uuid REFERENCES auth.users(id)
        );
        ALTER TABLE public.document_permissions ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Now create the policies for document_permissions if the table was just created
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'document_permissions') THEN
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Users can manage their own document permissions" ON public.document_permissions;
        DROP POLICY IF EXISTS "Document owners can manage permissions" ON public.document_permissions;
        
        -- Create new policies
        CREATE POLICY "Users can manage their own document permissions" 
        ON public.document_permissions 
        FOR ALL 
        USING (user_id = auth.uid());

        CREATE POLICY "Document owners can manage permissions" 
        ON public.document_permissions 
        FOR ALL 
        USING (EXISTS (
          SELECT 1 FROM documents d 
          WHERE d.id = document_permissions.document_id 
          AND d.owner_id = auth.uid()
        ));
    END IF;
END $$;