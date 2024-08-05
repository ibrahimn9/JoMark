import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

function VerifiedFill(props) {
  return (
    <Svg
      width={183}
      height={184}
      viewBox="0 0 183 184"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Circle cx={174} cy={35} r={9} fill="#264A99" />
      <Circle cx={46} cy={175} r={9} fill="#264A99" />
      <Circle cx={156.5} cy={153.5} r={4.5} fill="#264A99" />
      <Circle cx={12.5} cy={94.5} r={4.5} fill="#264A99" />
      <Circle cx={9} cy={9} r={9} fill="#264A99" />
      <Circle cx={94} cy={87} r={62} fill="#264A99" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M109.835 73.477L94.5 67.119a1.567 1.567 0 00-1.2 0l-15.335 6.358A1.563 1.563 0 0077 74.92v7.729a26.166 26.166 0 0016.309 24.235c.379.155.803.155 1.182 0A26.167 26.167 0 00110.8 82.649V74.92c0-.631-.381-1.2-.965-1.443zM92.992 89.174l7.906-7.894a1.842 1.842 0 012.602 0c.718.717.718 1.88 0 2.597l-9.207 9.194a1.841 1.841 0 01-2.602 0l-5.14-5.133a1.835 1.835 0 010-2.598 1.841 1.841 0 012.601 0l3.84 3.834z"
        fill="#fff"
      />
    </Svg>
  )
}

export default VerifiedFill