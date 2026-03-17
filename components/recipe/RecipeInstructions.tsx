export const RecipeInstructions = ({
  instructions,
}: {
  instructions: string[];
}) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-xl font-bold text-primary">Instructions</h2>
    <ol className="flex flex-col gap-4 list-decimal list-inside">
      {instructions.map((step, i) => (
        <li key={i} className="text-sm leading-relaxed">
          {step}
        </li>
      ))}
    </ol>
  </div>
);
