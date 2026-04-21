export const RecipeInstructions = ({
  instructions,
}: {
  instructions: string[];
}) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-xl lg:text-2xl font-bold text-primary">Instructions</h2>
    <ol className="flex flex-col gap-4 list-decimal list-inside">
      {instructions.map((step, i) => (
        <li key={i} className="text-sm md:text-base lg:text-lg leading-relaxed">
          {step}
        </li>
      ))}
    </ol>
  </div>
);
