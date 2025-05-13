export const styles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    width: "100%",
    padding: "4px", // Converts 2.5 to rem (Tailwind default)
    backgroundColor: "transparent",
    borderColor: "rgb(163 163 163)", // Equivalent to bg-zinc-400
    borderRadius: "0.375rem", // Converts to Tailwind's rounded-md
    fontFamily: "gilroy_medium",
    fontWeight: 500, // Equivalent to font-gilroy-medium
    color: "rgb(0 0 0)", // Equivalent to text-black
    outline: "none",
    boxShadow: "none",
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: "#8D8D8D", // Ensures placeholder text matches the input text color
  }),
  singleValue: (baseStyles) => ({
    ...baseStyles,
    color: "rgb(0 0 0)", // Matches single value text color to input text
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    zIndex: 999, // Optional for dropdown overlapping issues
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isFocused ? "rgb(239 239 239)" : "transparent", // Adds focus effect
    color: "rgb(0 0 0)",
    fontFamily: "gilroy_medium", // Ensures consistency with text-black
  }),
};
