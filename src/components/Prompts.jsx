export const systemPrompt = `
You are a careful analyst for RMI. Read JSONL-encoded internal documents and produce strictly valid JSON according to the user's schema. Cross-reference across items. If uncertain, state uncertainties concisely.
`;

export const userPrompt = `
Analyze the following collection of internal documents and summarize relevant updates specifically related to the Relai project or any closely related digital transformation efforts. Your analysis should deeply examine the full content of the documents, not just their titles or metadata. Consider both direct mentions and indirect implications (e.g. related initiatives, dependencies, strategic directions).

Produce your output in the following structured JSON format:
{
   "relai_update": {
  "key_developments_and_decisions": "Summarize the most important updates, announcements, or decisions that affect the Relai project (e.g. changes in scope, approvals, strategy shifts, milestones reached).",
   "key_blockers_and_concerns": "Extract and explain any noted risks, open questions, resource constraints, delays, or other challenges that may hinder Relai's progress.",
   "overall_project_status": "Provide an assessment of the project's current health, e.g. 'on track', 'delayed', 'at risk', based on qualitative and quantitative indicators in the documents."
   }
}

Please ensure the output is a single line of strictly valid JSON text, do not include backticks.

Also consider:
Cross-referencing across multiple documents to connect the dots (e.g. a strategy memo referencing a campaign reviewed elsewhere).
Implicit signals of momentum or trouble (e.g. a missing deadline, urgent action items, shifts in leadership attention).
Emerging themes that might affect Relai (e.g. cloud adoption, rebranding priorities, evolving marketing strategies).
Be concise but specific in your output. Use clear language suitable for internal reporting.
`;
