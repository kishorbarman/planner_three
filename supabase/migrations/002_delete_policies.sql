-- Add DELETE policies so users can erase their own data

CREATE POLICY days_delete ON days FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY tasks_delete ON tasks FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY haze_delete ON haze_items FOR DELETE TO authenticated USING (auth.uid() = user_id);
