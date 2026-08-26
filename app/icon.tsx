import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: "linear-gradient(135deg, #111317 0%, #060709 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "6px",
          border: "1px solid rgba(229, 9, 20, 0.4)",
          fontWeight: 900,
          fontFamily: "sans-serif",
          color: "#E50914",
          boxShadow: "0 0 10px rgba(229, 9, 20, 0.5)",
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}
