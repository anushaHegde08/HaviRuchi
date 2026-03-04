import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createRecipe: Recipe;
  deleteRecipe: Scalars['Boolean']['output'];
  updateRecipe: Recipe;
};


export type MutationCreateRecipeArgs = {
  input: RecipeInput;
};


export type MutationDeleteRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateRecipeArgs = {
  id: Scalars['ID']['input'];
  input: RecipeInput;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  recipe?: Maybe<Recipe>;
  recipes: Array<Recipe>;
  recipesByTag: Array<Recipe>;
  user?: Maybe<User>;
};


export type QueryRecipeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecipesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRecipesByTagArgs = {
  tag: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type Recipe = {
  __typename?: 'Recipe';
  cookTime?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ingredients: Array<Scalars['String']['output']>;
  instructions: Array<Scalars['String']['output']>;
  prepTime?: Maybe<Scalars['Int']['output']>;
  servings?: Maybe<Scalars['Int']['output']>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type RecipeInput = {
  cookTime?: InputMaybe<Scalars['Int']['input']>;
  description: Scalars['String']['input'];
  ingredients: Array<Scalars['String']['input']>;
  instructions: Array<Scalars['String']['input']>;
  prepTime?: InputMaybe<Scalars['Int']['input']>;
  servings?: InputMaybe<Scalars['Int']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  recipes: Array<Recipe>;
  username: Scalars['String']['output'];
};

export type GetRecipesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRecipesQuery = { __typename?: 'Query', recipes: Array<{ __typename?: 'Recipe', id: string, title: string, description: string, ingredients: Array<string>, instructions: Array<string> }> };

export type GetRecipeQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRecipeQuery = { __typename?: 'Query', recipe?: { __typename?: 'Recipe', id: string, title: string, description: string, ingredients: Array<string>, instructions: Array<string> } | null };

export type CreateRecipeMutationVariables = Exact<{
  input: RecipeInput;
}>;


export type CreateRecipeMutation = { __typename?: 'Mutation', createRecipe: { __typename?: 'Recipe', id: string, title: string, description: string } };


export const GetRecipesDocument = gql`
    query GetRecipes {
  recipes {
    id
    title
    description
    ingredients
    instructions
  }
}
    `;

export function useGetRecipesQuery(options?: Omit<Urql.UseQueryArgs<GetRecipesQueryVariables>, 'query'>) {
  return Urql.useQuery<GetRecipesQuery, GetRecipesQueryVariables>({ query: GetRecipesDocument, ...options });
};
export const GetRecipeDocument = gql`
    query GetRecipe($id: ID!) {
  recipe(id: $id) {
    id
    title
    description
    ingredients
    instructions
  }
}
    `;

export function useGetRecipeQuery(options: Omit<Urql.UseQueryArgs<GetRecipeQueryVariables>, 'query'>) {
  return Urql.useQuery<GetRecipeQuery, GetRecipeQueryVariables>({ query: GetRecipeDocument, ...options });
};
export const CreateRecipeDocument = gql`
    mutation CreateRecipe($input: RecipeInput!) {
  createRecipe(input: $input) {
    id
    title
    description
  }
}
    `;

export function useCreateRecipeMutation() {
  return Urql.useMutation<CreateRecipeMutation, CreateRecipeMutationVariables>(CreateRecipeDocument);
};