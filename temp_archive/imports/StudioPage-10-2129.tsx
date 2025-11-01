import svgPaths from "./svg-4kcefzme62";
import imgUserAvatar from "figma:asset/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png";

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[21px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[175.98px]">
        <p className="block leading-[normal]">Dreamscape Echoes</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-left w-[90.05px]">
        <p className="block leading-[normal]">Aurora Bloom</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container />
      <Container1 />
    </div>
  );
}

function UserAvatar() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[20px] shrink-0 size-10"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar}')` }}
    />
  );
}

function Button() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <UserAvatar />
    </div>
  );
}

function Container3() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-between left-6 p-0 right-6 top-6"
      data-name="Container"
    >
      <Container2 />
      <Button />
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[69.44px]">
        <p className="block leading-[normal]">AI Studio</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 p-0 right-0 top-0"
      data-name="Container"
    >
      <Heading2 />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path
            d={svgPaths.p34e8b500}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p13c15f80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p2be35b00}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d="M17 2L21 6L17 10"
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p6c13280}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p1f3b32f0}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group1 />
    </div>
  );
}

function Button3() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg2 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p2f913d00}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p1457c780}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group2 />
    </div>
  );
}

function Button4() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center px-0 py-0.5 relative shrink-0"
      data-name="Button"
    >
      <Svg3 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p2f913d00}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p2eda9dc0}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group3 />
    </div>
  );
}

function Button5() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center px-0 py-0.5 relative shrink-0"
      data-name="Button"
    >
      <Svg4 />
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-4 items-start justify-center left-0 pb-0 pt-[9px] px-0 right-0 top-[280px]"
      data-name="HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#30363d] border-[1px_0px_0px] border-solid inset-0 pointer-events-none"
      />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[45.83px]">
        <p className="block leading-[normal]">Tempo</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pl-36 pr-48 py-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container6 />
    </div>
  );
}

function InputMargin() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[356px]"
      data-name="Input:margin"
    >
      <Input />
    </div>
  );
}

function Container7() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container5 />
      <InputMargin />
    </div>
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[93px]">
        <p className="block leading-[normal]">Key Signature</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 p-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container9 />
    </div>
  );
}

function InputMargin1() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[356px]"
      data-name="Input:margin"
    >
      <Input1 />
    </div>
  );
}

function Container10() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container8 />
      <InputMargin1 />
    </div>
  );
}

function Container11() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-3 items-start justify-start left-0 p-0 right-0 top-[337px]"
      data-name="Container"
    >
      <Container7 />
      <Container10 />
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[178.06px]">
        <p className="block leading-[normal]">{`AI Effects & Processing`}</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 p-0 right-0 top-[443px]"
      data-name="Container"
    >
      <Heading4 />
    </div>
  );
}

function Container13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[67.95px]">
        <p className="block leading-[normal]">Pitch Shift</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 px-[168px] py-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input2() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container14 />
    </div>
  );
}

function InputMargin2() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[356px]"
      data-name="Input:margin"
    >
      <Input2 />
    </div>
  );
}

function Container15() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container13 />
      <InputMargin2 />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[130.05px]">
        <p className="block leading-[normal]">Formant Correction</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 px-[168px] py-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input3() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container17 />
    </div>
  );
}

function InputMargin3() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[356px]"
      data-name="Input:margin"
    >
      <Input3 />
    </div>
  );
}

function Container18() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container16 />
      <InputMargin3 />
    </div>
  );
}

function Container19() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[85.38px]">
        <p className="block leading-[normal]">Time Stretch</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pl-[111.98px] pr-[224.02px] py-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input4() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container20 />
    </div>
  );
}

function InputMargin4() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[356px]"
      data-name="Input:margin"
    >
      <Input4 />
    </div>
  );
}

function Container21() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container19 />
      <InputMargin4 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.pd81adc0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p10d80800}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group4 />
    </div>
  );
}

function Button6() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-row gap-1 items-center justify-center px-3.5 py-2.5 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#000000] border-solid inset-0 pointer-events-none rounded-[7px]"
      />
      <Svg5 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-center w-[73.58px]">
        <p className="block leading-[normal]">Lo-fi Mode</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pl-[99.2px] pr-[99.22px] py-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input5() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container22 />
    </div>
  );
}

function InputMargin5() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[218.42px]"
      data-name="Input:margin"
    >
      <Input5 />
    </div>
  );
}

function Container23() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button6 />
      <InputMargin5 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p1db8a9e0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p1b1a3840}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group5 />
    </div>
  );
}

function IconifyIcon() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg6 />
    </div>
  );
}

function Button7() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-0 px-4 py-3 right-[180px] rounded-[7px] top-0"
      data-name="Button"
    >
      <IconifyIcon />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[117.3px]">
        <p className="block leading-[normal]">Spectral Enhance</p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p21ec88c0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p30a3ea40}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p28159780}
            id="Vector_3"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p350d0c60}
            id="Vector_4"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group6 />
    </div>
  );
}

function IconifyIcon1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg7 />
    </div>
  );
}

function Button8() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-[180px] px-4 py-3 right-0 rounded-[7px] top-0"
      data-name="Button"
    >
      <IconifyIcon1 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[81.52px]">
        <p className="block leading-[normal]">Dynamic EQ</p>
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p21ec88c0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p30a3ea40}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p28159780}
            id="Vector_3"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p350d0c60}
            id="Vector_4"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg8() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group7 />
    </div>
  );
}

function IconifyIcon2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg8 />
    </div>
  );
}

function Button9() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-0 px-4 py-3 right-0 rounded-[7px] top-[73px]"
      data-name="Button"
    >
      <IconifyIcon2 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[113.55px]">
        <p className="block leading-[normal]">Intelligent Comp.</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[138px] relative shrink-0 w-full" data-name="Container">
      <Button7 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[112.81px]">
        <p className="block leading-[normal]">AI Style Transfer</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading3 />
    </div>
  );
}

function Button10() {
  return (
    <div
      className="absolute bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center left-0 px-3 py-2 rounded-[7px] top-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[64.73px]">
        <p className="block leading-[normal]">Chill Lo-fi</p>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div
      className="absolute bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center left-[96.73px] px-3 py-2 rounded-[7px] top-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[98.56px]">
        <p className="block leading-[normal]">Energetic EDM</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div
      className="absolute bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center left-0 px-3 py-2 rounded-[7px] top-[41px]"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[103.23px]">
        <p className="block leading-[normal]">Acoustic Ballad</p>
      </div>
    </div>
  );
}

function Button13() {
  return (
    <div
      className="absolute bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center left-[135.23px] px-3 py-2 rounded-[7px] top-[41px]"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[71.66px]">
        <p className="block leading-[normal]">Retro Funk</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[74px] relative shrink-0 w-full" data-name="Container">
      <Button10 />
      <Button11 />
      <Button12 />
      <Button13 />
    </div>
  );
}

function Container27() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-4 items-start justify-start left-0 p-0 right-0 top-[487px]"
      data-name="Container"
    >
      <Container15 />
      <Container18 />
      <Container21 />
      <Container23 />
      <Container24 />
      <Container25 />
      <Container26 />
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[187.59px]">
        <p className="block leading-[normal]">{`Presets & Customization`}</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 p-0 right-0 top-[981px]"
      data-name="Container"
    >
      <Heading5 />
    </div>
  );
}

function Button14() {
  return (
    <div
      className="absolute bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center left-0 px-3 py-2 rounded-[7px] top-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[80.36px]">
        <p className="block leading-[normal]">Vocal Booth</p>
      </div>
    </div>
  );
}

function Button15() {
  return (
    <div
      className="absolute bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center left-[112.36px] px-3 py-2 rounded-[7px] top-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[83.92px]">
        <p className="block leading-[normal]">Studio Vocal</p>
      </div>
    </div>
  );
}

function Button16() {
  return (
    <div
      className="absolute bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center left-0 px-3 py-2 rounded-[7px] top-[41px]"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[109.34px]">
        <p className="block leading-[normal]">Radio Broadcast</p>
      </div>
    </div>
  );
}

function Button17() {
  return (
    <div
      className="absolute bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center left-[141.34px] px-3 py-2 rounded-[7px] top-[41px]"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[98.41px]">
        <p className="block leading-[normal]">Ambient Synth</p>
      </div>
    </div>
  );
}

function Button18() {
  return (
    <div
      className="absolute bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center left-0 px-3 py-2 rounded-[7px] top-[82px]"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[67.42px]">
        <p className="block leading-[normal]">EDM Drop</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="absolute h-[115px] left-0 right-0 top-[1025px]" data-name="Container">
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
      <Button18 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p34b54800}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p7f02700}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group8 />
    </div>
  );
}

function Button19() {
  return (
    <div className="bg-[#ff22fb] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-3 relative w-full">
          <Svg9 />
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center w-[134.88px]">
            <p className="block leading-[normal]">Save Custom Preset</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-2 px-0 right-0 top-[1164px]"
      data-name="Button:margin"
    >
      <Button19 />
    </div>
  );
}

function Svg10() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p3177aac0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Button20() {
  return (
    <div className="bg-[#161b22] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-3 relative w-full">
          <Svg10 />
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[141.95px]">
            <p className="block leading-[normal]">AI Recommendations</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-2 px-0 right-0 top-[1240px]"
      data-name="Button:margin"
    >
      <Button20 />
    </div>
  );
}

function Heading6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[98.53px]">
        <p className="block leading-[normal]">Editing Tools</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 p-0 right-0 top-[1316px]"
      data-name="Container"
    >
      <Heading6 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p3696f880}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p28559280}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.pb3acd80}
            id="Vector_3"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p164f2180}
            id="Vector_4"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg11() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group9 />
    </div>
  );
}

function IconifyIcon3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg11 />
    </div>
  );
}

function Button21() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-0 px-4 py-3 right-[180px] rounded-[7px] top-0"
      data-name="Button"
    >
      <IconifyIcon3 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[23.47px]">
        <p className="block leading-[normal]">Cut</p>
      </div>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p3fd8f680}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p2b428080}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg12() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group10 />
    </div>
  );
}

function IconifyIcon4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg12 />
    </div>
  );
}

function Button22() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-[180px] px-4 py-3 right-0 rounded-[7px] top-0"
      data-name="Button"
    >
      <IconifyIcon4 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[35.17px]">
        <p className="block leading-[normal]">Copy</p>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p14c9b6c0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p18583140}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg13() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group11 />
    </div>
  );
}

function IconifyIcon5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg13 />
    </div>
  );
}

function Button23() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-0 px-4 py-3 right-[180px] rounded-[7px] top-[73px]"
      data-name="Button"
    >
      <IconifyIcon5 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[37.27px]">
        <p className="block leading-[normal]">Paste</p>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d="M2.5 5.83333V10.8333H7.5"
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p148c8100}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg14() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group12 />
    </div>
  );
}

function IconifyIcon6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg14 />
    </div>
  );
}

function Button24() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-[180px] px-4 py-3 right-0 rounded-[7px] top-[73px]"
      data-name="Button"
    >
      <IconifyIcon6 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[35.91px]">
        <p className="block leading-[normal]">Undo</p>
      </div>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d="M17.5 5.83333V10.8333H12.5"
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p9aa8480}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg15() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group13 />
    </div>
  );
}

function IconifyIcon7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg15 />
    </div>
  );
}

function Button25() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-0 px-4 py-3 right-[180px] rounded-[7px] top-[146px]"
      data-name="Button"
    >
      <IconifyIcon7 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[34.22px]">
        <p className="block leading-[normal]">Redo</p>
      </div>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p1db8a9e0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p1b1a3840}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg16() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group14 />
    </div>
  );
}

function IconifyIcon8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg16 />
    </div>
  );
}

function Button26() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-[180px] px-4 py-3 right-0 rounded-[7px] top-[146px]"
      data-name="Button"
    >
      <IconifyIcon8 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[115.17px]">
        <p className="block leading-[normal]">AI Auto-Segment</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="absolute h-[211px] left-0 right-0 top-[1360px]" data-name="Container">
      <Button21 />
      <Button22 />
      <Button23 />
      <Button24 />
      <Button25 />
      <Button26 />
    </div>
  );
}

function Heading7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[192.66px]">
        <p className="block leading-[normal]">{`Remix & Stem Separation`}</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 p-0 right-0 top-[1595px]"
      data-name="Container"
    >
      <Heading7 />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p30cdd880}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p21bf4d80}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg17() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group15 />
    </div>
  );
}

function IconifyIcon9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg17 />
    </div>
  );
}

function Button27() {
  return (
    <div
      className="[grid-area:1_/_1] bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-center pl-[31.61px] pr-[31.62px] py-3 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon9 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[108.77px]">
        <p className="block leading-[normal]">Separate Vocals</p>
      </div>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p298258c0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p2bc19280}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg18() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group16 />
    </div>
  );
}

function IconifyIcon10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg18 />
    </div>
  );
}

function Button28() {
  return (
    <div
      className="[grid-area:2_/_1] bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-center pl-[32.09px] pr-[32.1px] py-3 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon10 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[107.81px]">
        <p className="block leading-[normal]">Separate Drums</p>
      </div>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p21ec88c0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p30a3ea40}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p28159780}
            id="Vector_3"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p350d0c60}
            id="Vector_4"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg19() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group17 />
    </div>
  );
}

function IconifyIcon11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg19 />
    </div>
  );
}

function Button29() {
  return (
    <div
      className="[grid-area:3_/_1] bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-center pl-[37.94px] pr-[37.93px] py-3 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon11 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[96.13px]">
        <p className="block leading-[normal]">Separate Bass</p>
      </div>
    </div>
  );
}

function Svg20() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p2b225380}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg20 />
    </div>
  );
}

function Button30() {
  return (
    <div
      className="[grid-area:4_/_1] bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-center pl-[35.27px] pr-[35.26px] py-3 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon12 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[101.47px]">
        <p className="block leading-[normal]">Separate Other</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div
      className="absolute box-border grid grid-cols-[repeat(1,_minmax(0px,_1fr))] grid-rows-[fit-content(100%)_fit-content(100%)_fit-content(100%)_fit-content(100%)] h-[260px] left-0 p-0 right-0 top-[1639px]"
      data-name="Container"
    >
      <Button27 />
      <Button28 />
      <Button29 />
      <Button30 />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p13d088c0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p3728e940}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg21() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group18 />
    </div>
  );
}

function Button31() {
  return (
    <div className="bg-[#161b22] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-col items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-center justify-center px-5 py-3 relative w-full">
          <Svg21 />
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[81.97px]">
            <p className="block leading-[normal]">Stem Morph</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-2 px-0 right-0 top-[1923px]"
      data-name="Button:margin"
    >
      <Button31 />
    </div>
  );
}

function Heading8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[200.81px]">
        <p className="block leading-[normal]">{`Automation & Fine Control`}</p>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 p-0 right-0 top-[2024px]"
      data-name="Container"
    >
      <Heading8 />
    </div>
  );
}

function Background() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col items-center justify-start left-0 p-[16px] right-0 rounded-[7px] top-[2068px]"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[34px] justify-center leading-[normal] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-center w-[308.7px]">
        <p className="block mb-0">Automation lanes for volume, pitch, effects will</p>
        <p className="block">appear here.</p>
      </div>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p1db8a9e0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p1b1a3840}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg22() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group19 />
    </div>
  );
}

function Button32() {
  return (
    <div className="bg-[#161b22] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-3 relative w-full">
          <Svg22 />
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[181.48px]">
            <p className="block leading-[normal]">AI Automation Suggestions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonMargin3() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-2 px-0 right-0 top-[2158px]"
      data-name="Button:margin"
    >
      <Button32 />
    </div>
  );
}

function Heading9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[161.27px]">
        <p className="block leading-[normal]">{`Integration & Sharing`}</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 p-0 right-0 top-[2234px]"
      data-name="Container"
    >
      <Heading9 />
    </div>
  );
}

function Svg23() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p11ff3e80}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Button33() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-3 relative rounded-[7px] shrink-0 w-[170px]"
      data-name="Button"
    >
      <Svg23 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center w-[53.27px]">
        <p className="block leading-[normal]">Preview</p>
      </div>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p1697f500}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p2d992200}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p25edf880}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p3a21ac40}
            id="Vector_4"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg24() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group20 />
    </div>
  );
}

function Button34() {
  return (
    <div
      className="bg-[#484f58] box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-3 relative rounded-[7px] shrink-0 w-[170px]"
      data-name="Button"
    >
      <Svg24 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-center w-[38.8px]">
        <p className="block leading-[normal]">Share</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button33 />
      <Button34 />
    </div>
  );
}

function Margin() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-4 px-0 right-0 top-[2278px]"
      data-name="Margin"
    >
      <Container36 />
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p36930d00}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p12512780}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg25() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group21 />
    </div>
  );
}

function Button35() {
  return (
    <div className="bg-[#ff22fb] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-3 relative w-full">
          <Svg25 />
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center w-[105.3px]">
            <p className="block leading-[normal]">Mint NFT (TON)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonMargin4() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-2 px-0 right-0 top-[2362px]"
      data-name="Button:margin"
    >
      <Button35 />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p1efa16f0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p8a91597}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg26() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group22 />
    </div>
  );
}

function Button36() {
  return (
    <div className="bg-[#161b22] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-3 relative w-full">
          <Svg26 />
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[77px]">
            <p className="block leading-[normal]">Collaborate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonMargin5() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-2 px-0 right-0 top-[2438px]"
      data-name="Button:margin"
    >
      <Button36 />
    </div>
  );
}

function Heading10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[191.67px]">
        <p className="block leading-[normal]">Additional Creative Tools</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-0 p-0 right-0 top-[2514px]"
      data-name="Container"
    >
      <Heading10 />
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p153feac0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p98cdb00}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg27() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group23 />
    </div>
  );
}

function IconifyIcon13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg27 />
    </div>
  );
}

function Button37() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-0 px-4 py-3 right-[180px] rounded-[7px] top-0"
      data-name="Button"
    >
      <IconifyIcon13 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[98.39px]">
        <p className="block leading-[normal]">MIDI Keyboard</p>
      </div>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p30cdd880}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p21bf4d80}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg28() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group24 />
    </div>
  );
}

function IconifyIcon14() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg28 />
    </div>
  );
}

function Button38() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-[180px] px-4 py-3 right-0 rounded-[7px] top-0"
      data-name="Button"
    >
      <IconifyIcon14 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[102.48px]">
        <p className="block leading-[normal]">Lyric to Melody</p>
      </div>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p21ec88c0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p30a3ea40}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p28159780}
            id="Vector_3"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p350d0c60}
            id="Vector_4"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg29() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group25 />
    </div>
  );
}

function IconifyIcon15() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg29 />
    </div>
  );
}

function Button39() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-0 px-4 py-3 right-[180px] rounded-[7px] top-[73px]"
      data-name="Button"
    >
      <IconifyIcon15 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[124.08px]">
        <p className="block leading-[normal]">AI Vocal Synthesis</p>
      </div>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p21ec88c0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p30a3ea40}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p28159780}
            id="Vector_3"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p350d0c60}
            id="Vector_4"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg30() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group26 />
    </div>
  );
}

function IconifyIcon16() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg30 />
    </div>
  );
}

function Button40() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start left-[180px] px-4 py-3 right-0 rounded-[7px] top-[73px]"
      data-name="Button"
    >
      <IconifyIcon16 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[81.8px]">
        <p className="block leading-[normal]">Create Loop</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="absolute h-[138px] left-0 right-0 top-[2558px]" data-name="Container">
      <Button37 />
      <Button38 />
      <Button39 />
      <Button40 />
    </div>
  );
}

function Container39() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left tracking-[0.5px] uppercase w-[59.36px]">
        <p className="adjustLetterSpacing block leading-[normal]">FULL MIX</p>
      </div>
    </div>
  );
}

function Svg31() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.pe21fe00}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Button41() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg31 />
    </div>
  );
}

function Svg32() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p2d06a740}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Button42() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg32 />
    </div>
  );
}

function Container40() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Button41 />
      <Button42 />
    </div>
  );
}

function Container41() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container39 />
      <Container40 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#0d1117] h-10 relative rounded shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-end overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row h-10 items-end justify-between pl-2 pr-[8.23px] py-0 relative w-full">
          <div className="bg-[#ff22fb] h-4 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-6 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-8 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-5 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-7 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[18px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[26px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-9 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[22px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[30px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-3.5 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[34px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-5 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-7 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-6 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-8 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-4 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[38px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-7 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-5 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container41 />
      <Background1 />
    </div>
  );
}

function Container43() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left tracking-[0.5px] uppercase w-[51.86px]">
        <p className="adjustLetterSpacing block leading-[normal]">VOCALS</p>
      </div>
    </div>
  );
}

function Svg33() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p22d8780}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Button43() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg33 />
    </div>
  );
}

function Svg34() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p2d06a740}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Button44() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg34 />
    </div>
  );
}

function Container44() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Button43 />
      <Button44 />
    </div>
  );
}

function Container45() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container43 />
      <Container44 />
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#0d1117] h-10 relative rounded shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-end overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row h-10 items-end justify-between pl-2 pr-[8.03px] py-0 relative w-full">
          <div className="bg-[#ff22fb] h-4 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-8 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-7 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[26px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[22px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-3.5 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-5 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-6 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-4 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-7 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container45 />
      <Background2 />
    </div>
  );
}

function Container47() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left tracking-[0.5px] uppercase w-[92.86px]">
        <p className="adjustLetterSpacing block leading-[normal]">INSTRUMENTS</p>
      </div>
    </div>
  );
}

function Svg35() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p22d8780}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Button45() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg35 />
    </div>
  );
}

function Svg36() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p2d06a740}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Button46() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg36 />
    </div>
  );
}

function Container48() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Button45 />
      <Button46 />
    </div>
  );
}

function Container49() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container47 />
      <Container48 />
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#0d1117] h-10 relative rounded shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-end overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row h-10 items-end justify-between pl-2 pr-[8.03px] py-0 relative w-full">
          <div className="bg-[#ff22fb] h-6 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-5 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[18px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-9 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[30px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[34px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-7 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-8 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-[38px] opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
          <div className="bg-[#ff22fb] h-5 opacity-70 rounded-[1.5px] shrink-0 w-[3px]" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container49 />
      <Background3 />
    </div>
  );
}

function Background4() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-start justify-start left-0 overflow-clip p-[8px] right-0 rounded-lg top-11"
      data-name="Background"
    >
      <Container42 />
      <Container46 />
      <Container50 />
      <div
        className="absolute bg-[#d73a49] bottom-0 top-0 translate-x-[-50%] w-0.5"
        data-name="Vertical Divider"
        style={{ left: "calc(50% + 1px)" }}
      />
    </div>
  );
}

function Container52() {
  return (
    <div className="absolute h-[2696px] left-6 right-6 top-[90px]" data-name="Container">
      <Container4 />
      <HorizontalBorder />
      <Container11 />
      <Container12 />
      <Container27 />
      <Container28 />
      <Container29 />
      <ButtonMargin />
      <ButtonMargin1 />
      <Container30 />
      <Container31 />
      <Container32 />
      <Container33 />
      <ButtonMargin2 />
      <Container34 />
      <Background />
      <ButtonMargin3 />
      <Container35 />
      <Margin />
      <ButtonMargin4 />
      <ButtonMargin5 />
      <Container37 />
      <Container38 />
      <Background4 />
      <Container31 />
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d="M9 18V5L21 3V16"
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p29b85680}
            id="Vector_2"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p42b6d80}
            id="Vector_3"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg43() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group33 />
    </div>
  );
}

function IconifyIcon23() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg43 />
    </div>
  );
}

function Button53() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start px-1 py-2 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon23 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff22fb] text-[12px] text-center w-[35.72px]">
        <p className="block leading-[normal]">Player</p>
      </div>
    </div>
  );
}

function Svg44() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path
            d={svgPaths.p2cf77780}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon24() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg44 />
    </div>
  );
}

function Button54() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start px-1 py-2 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon24 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[47.27px]">
        <p className="block leading-[normal]">Playlists</p>
      </div>
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p2c028200}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p303930a8}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg45() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group34 />
    </div>
  );
}

function IconifyIcon25() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg45 />
    </div>
  );
}

function Button55() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start px-1 py-2 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon25 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[51.19px]">
        <p className="block leading-[normal]">Contests</p>
      </div>
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p311dd680}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p68f4a00}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg46() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group35 />
    </div>
  );
}

function IconifyIcon26() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg46 />
    </div>
  );
}

function Button56() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start px-1 py-2 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon26 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[37.05px]">
        <p className="block leading-[normal]">Profile</p>
      </div>
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p14925800}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p1f999680}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg47() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group36 />
    </div>
  );
}

function IconifyIcon27() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg47 />
    </div>
  );
}

function Button57() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start px-1 py-2 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon27 />
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[47.08px]">
        <p className="block leading-[normal]">Settings</p>
      </div>
    </div>
  );
}

function BackgroundHorizontalBorder() {
  return (
    <div
      className="bg-[#0d1117] box-border content-stretch flex flex-row gap-[28.3px] items-center justify-start pb-3 pl-[14.16px] pr-[14.23px] pt-[13px] relative rounded-bl-[16px] rounded-br-[16px] shrink-0 w-[400px]"
      data-name="Background+HorizontalBorder"
    >
      <div
        aria-hidden="true"
        className="absolute border-[#30363d] border-[1px_0px_0px] border-solid inset-0 pointer-events-none rounded-bl-[16px] rounded-br-[16px]"
      />
      <Button53 />
      <Button54 />
      <Button55 />
      <Button56 />
      <Button57 />
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="absolute bottom-[25px] box-border content-stretch flex flex-col items-start justify-start p-0 translate-x-[-50%] w-[376px]"
      data-name="Margin"
      style={{ left: "calc(50% - 12px)" }}
    >
      <BackgroundHorizontalBorder />
    </div>
  );
}

function Heading11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[94.22px]">
        <p className="block leading-[normal]">Audio Editor</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading11 />
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-end overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[60px] items-end justify-start px-[46px] py-0 relative w-full">
          <div className="bg-[#ff22fb] h-8 opacity-70 rounded-sm shrink-0 w-1" data-name="Background" />
          <div className="bg-[#ff22fb] h-12 opacity-70 rounded-sm shrink-0 w-1" data-name="Background" />
          <div className="bg-[#ff22fb] h-16 opacity-70 rounded-sm shrink-0 w-1" data-name="Background" />
          <div className="bg-[#ff22fb] h-10 opacity-70 rounded-sm shrink-0 w-1" data-name="Background" />
          <div className="bg-[#ff22fb] h-14 opacity-70 rounded-sm shrink-0 w-1" data-name="Background" />
        </div>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Label"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[33.64px]">
        <p className="block leading-[normal]">Pitch</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 px-[168px] py-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input6() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container54 />
    </div>
  );
}

function InputMargin6() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[356px]"
      data-name="Input:margin"
    >
      <Input6 />
    </div>
  );
}

function Container55() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Label />
      <InputMargin6 />
    </div>
  );
}

function Label1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Label"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[45.83px]">
        <p className="block leading-[normal]">Tempo</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pl-[201.59px] pr-[134.41px] py-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input7() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container56 />
    </div>
  );
}

function InputMargin7() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[356px]"
      data-name="Input:margin"
    >
      <Input7 />
    </div>
  );
}

function Container57() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Label1 />
      <InputMargin7 />
    </div>
  );
}

function Label2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Label"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[61.77px]">
        <p className="block leading-[normal]">Equalizer</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pl-[235.19px] pr-[100.81px] py-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input8() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container58 />
    </div>
  );
}

function InputMargin8() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[356px]"
      data-name="Input:margin"
    >
      <Input8 />
    </div>
  );
}

function Container59() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Label2 />
      <InputMargin8 />
    </div>
  );
}

function Label3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Label"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[73.58px]">
        <p className="block leading-[normal]">Lo-fi Mode</p>
      </div>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p19217760}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p1878d700}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg48() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group37 />
    </div>
  );
}

function Button58() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center px-[164px] py-0 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <Svg48 />
    </div>
  );
}

function Container60() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Label3 />
      <Button58 />
    </div>
  );
}

function Container61() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container55 />
      <Container57 />
      <Container59 />
      <Container60 />
    </div>
  );
}

function Button59() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center px-3 py-2 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[79.47px]">
        <p className="block leading-[normal]">Vocal Boost</p>
      </div>
    </div>
  );
}

function Button60() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center px-3 py-2 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[68.33px]">
        <p className="block leading-[normal]">Bass Drop</p>
      </div>
    </div>
  );
}

function Button61() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center px-3 py-2 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[98.5px]">
        <p className="block leading-[normal]">Echo Chamber</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button59 />
      <Button60 />
      <Button61 />
    </div>
  );
}

function Container63() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-4 items-start justify-start left-6 p-0 right-6 top-[2808px]"
      data-name="Container"
    >
      <Container53 />
      <Background5 />
      <Container61 />
      <Container62 />
    </div>
  );
}

function Heading12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[92.47px]">
        <p className="block leading-[normal]">Remix Tools</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading12 />
    </div>
  );
}

function Group38() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p3696f880}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p28559280}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.pb3acd80}
            id="Vector_3"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p164f2180}
            id="Vector_4"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg49() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group38 />
    </div>
  );
}

function IconifyIcon28() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg49 />
    </div>
  );
}

function Button62() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start px-4 py-3 relative rounded-[7px] shrink-0 w-[109.06px]"
      data-name="Button"
    >
      <IconifyIcon28 />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[23.47px]">
        <p className="block leading-[normal]">Cut</p>
      </div>
    </div>
  );
}

function Group39() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p3610ce00}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p2bad7f00}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p21a14f80}
            id="Vector_3"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg50() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group39 />
    </div>
  );
}

function IconifyIcon29() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg50 />
    </div>
  );
}

function Button63() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start px-4 py-3 relative rounded-[7px] shrink-0 w-[109.06px]"
      data-name="Button"
    >
      <IconifyIcon29 />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[33.48px]">
        <p className="block leading-[normal]">Loop</p>
      </div>
    </div>
  );
}

function Group40() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.pf0d4b00}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p10e17d00}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg51() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group40 />
    </div>
  );
}

function IconifyIcon30() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg51 />
    </div>
  );
}

function Button64() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start px-4 py-3 relative rounded-[7px] shrink-0 w-[109.89px]"
      data-name="Button"
    >
      <IconifyIcon30 />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[77.89px]">
        <p className="block leading-[normal]">Restructure</p>
      </div>
    </div>
  );
}

function Container65() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button62 />
      <Button63 />
      <Button64 />
    </div>
  );
}

function Container66() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-4 items-start justify-start left-6 p-0 right-6 top-[3187px]"
      data-name="Container"
    >
      <Container64 />
      <Container65 />
    </div>
  );
}

function Heading13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[79.13px]">
        <p className="block leading-[normal]">Crossfade</p>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading13 />
    </div>
  );
}

function Container68() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pl-[100.8px] pr-[235.2px] py-0 right-0 top-[-5px]"
      data-name="Container"
    >
      <div className="bg-[#ff22fb] rounded-lg shrink-0 size-4" data-name="Background" />
    </div>
  );
}

function Input9() {
  return (
    <div className="bg-[#161b22] h-1.5 relative rounded-[3px] shrink-0 w-full" data-name="Input">
      <Container68 />
    </div>
  );
}

function InputMargin9() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-2.5 items-start justify-start p-[2px] relative shrink-0 w-[356px]"
      data-name="Input:margin"
    >
      <Input9 />
    </div>
  );
}

function Container69() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-4 items-start justify-start left-6 p-0 right-6 top-[3409px]"
      data-name="Container"
    >
      <Container67 />
      <InputMargin9 />
      <div
        className="bg-gradient-to-r from-[#ff22fb] h-[30px] opacity-60 rounded shrink-0 to-[#ff22fb] via-50% via-[#484f58] w-full"
        data-name="Gradient"
      />
    </div>
  );
}

function Group41() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p34b54800}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p7f02700}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg52() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group41 />
    </div>
  );
}

function Button65() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-row gap-2 h-11 items-center justify-center pl-[122.3px] pr-[122.29px] py-3 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <Svg52 />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center w-[79.41px]">
        <p className="block leading-[normal]">Save Preset</p>
      </div>
    </div>
  );
}

function Group42() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p1697f500}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p2d992200}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p25edf880}
            id="Vector_3"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p3a21ac40}
            id="Vector_4"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg53() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group42 />
    </div>
  );
}

function Button66() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-row gap-2 h-11 items-center justify-center pl-[142.59px] pr-[142.61px] py-3 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <Svg53 />
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center w-[38.8px]">
        <p className="block leading-[normal]">Share</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-3 items-start justify-start left-6 p-0 right-6 top-[3525px]"
      data-name="Container"
    >
      <Button65 />
      <Button66 />
    </div>
  );
}

function Background6() {
  return (
    <div
      className="bg-[#161b22] h-[3791px] overflow-clip relative rounded-2xl shrink-0 w-[400px]"
      data-name="Background"
    >
      <Container3 />
      <Container52 />
      <Margin1 />
      <Container63 />
      <Container66 />
      <Container69 />
      <Container70 />
    </div>
  );
}

export default function StudioPage() {
  return (
    <div className="bg-[#0d1117] relative size-full" data-name="Studio page">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-start justify-center p-[20px] relative size-full">
          <Background6 />
        </div>
      </div>
    </div>
  );
}