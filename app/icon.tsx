import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

const Icon = () => {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: "#2563EB",
          color: "white",
          padding: "0.5rem",
          textTransform: "capitalize",
          borderRadius: "0.375rem",
          width: `${size.width}px`,
          height: `${size.height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          fontWeight: "800",
        }}
      >
        IH
      </div>
    ),
    {
      ...size,
    }
  );
};

export default Icon;
