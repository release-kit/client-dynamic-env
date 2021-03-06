module.exports = {
  types: [
    { name: "đ¸ feat:     A new feature", value: "feat" },
    { name: "đ fix:      A bug fix", value: "fix" },
    { name: "đ¯ wip:      Work in progress", value: "wip" },
    { name: "đ¤ chore:    Build process or auxiliary tool change", value: "chore" },
    { name: "đĄ refactor: A code change that neither fixes a bug or adds a feature", value: "refactor" },
    { name: "đ style:    Markup, white-space, formatting, missing semi-colons...", value: "style" },
    { name: "đ test:     Adding missing tests", value: "test" },
    { name: "đĒ perf:     A code change that improves performance", value: "perf" },
    { name: "âī¸ docs:     Documentation only changes", value: "docs" },
    { name: "đšī¸ ci:       CI related changes", value: "ci" },
    { name: "đĨ revert:   Revert to a commit", value: "revert" },
  ],
  allowCustomScopes: true,
  skipQuestions: ["footer"],
  allowBreakingChanges: ["feat", "fix", "revert", "refactor"],
}
