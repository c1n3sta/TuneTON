import svgPaths from "./svg-v3dj02t4hj";
import imgRemixCover from "figma:asset/92af5e42f7a6be5cc4a3570d7557d9b846376457.png";
import imgUserAvatar from "figma:asset/2c1ea409c4a8bfeb11753d30276fdd21b9e259ae.png";
import imgUserAvatar1 from "figma:asset/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png";
import imgUserAvatar2 from "figma:asset/fe77acbd3c2d9b2551ab121351073eed5eec763a.png";
import imgUserAvatar3 from "figma:asset/02641910bdc93d1d98cf6da313c9fe42f75a5679.png";
import imgUserAvatar4 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";
import imgTrackCover from "figma:asset/063bcbc0dfe8da3f7c3395961e76884ea1607364.png";
import imgTrackCover1 from "figma:asset/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png";
import imgUserAvatar5 from "figma:asset/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png";

function Svg() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path
            d="M12 19L5 12L12 5M19 12H5"
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg />
    </div>
  );
}

function Heading1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-[312px]"
      data-name="Heading 1"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[18px] text-center w-[208.89px]">
        <p className="block leading-[normal]">Galactic Groove (Remix)</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-4 items-center justify-start left-0 pb-4 pt-6 px-6 right-0 top-0"
      data-name="Container"
    >
      <Button />
      <Heading1 />
    </div>
  );
}

function Margin() {
  return <div className="absolute bottom-[1919px] h-6 left-1/2 translate-x-[-50%] w-[448px]" data-name="Margin" />;
}

function RemixCover() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[150%_100%,auto] rounded-xl shrink-0 size-[120px]"
      data-name="Remix Cover"
      style={{ backgroundImage: `url('${imgRemixCover}')` }}
    />
  );
}

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[208.89px]">
        <p className="block leading-[normal]">Galactic Groove (Remix)</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[normal] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-left w-[208.86px]">
        <p className="block mb-0">Original by: StarDust • Remixed</p>
        <p className="block">by: DJ Echo</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p14439120}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p3fdfc3c0}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group />
    </div>
  );
}

function IconifyIcon() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg1 />
    </div>
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-left w-[38.38px]">
        <p className="block leading-[normal]">35.8K</p>
      </div>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p378a2380}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg2 />
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon1 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-left w-[17.34px]">
        <p className="block leading-[normal]">89</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container3 />
      <Container4 />
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-8" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="SVG">
          <path
            d={svgPaths.p225f300}
            id="Vector"
            stroke="var(--stroke-0, #D29922)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg3 />
    </div>
  );
}

function Button1() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2 relative rounded-xl shrink-0"
      data-name="Button"
    >
      <IconifyIcon2 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-center w-[30.19px]">
        <p className="block leading-[normal]">250</p>
      </div>
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-8" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="SVG">
          <path
            d={svgPaths.p39d9e480}
            id="Vector"
            stroke="var(--stroke-0, #D73A49)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg4 />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2 relative rounded-xl shrink-0 w-[93px]"
      data-name="Button"
    >
      <IconifyIcon3 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-center w-[32.75px]">
        <p className="block leading-[normal]">1.2K</p>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p16526a80}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon4() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[34px] items-center justify-center p-0 relative shrink-0 w-[38px]"
      data-name="iconify-icon"
    >
      <Svg5 />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button1 />
      <Button2 />
      <IconifyIcon4 />
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container6 />
    </div>
  );
}

function Background() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-row items-start justify-start left-0 px-2 py-1 rounded-[5px] top-[-4px]"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[10px] text-left tracking-[0.5px] uppercase w-[68.36px]">
        <p className="adjustLetterSpacing block leading-[normal]">ELECTRONIC</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-row items-start justify-start left-[84.36px] px-2 py-1 rounded-[5px] top-[-4px]"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[10px] text-left tracking-[0.5px] uppercase w-[56.89px]">
        <p className="adjustLetterSpacing block leading-[normal]">UPLIFTING</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="h-6 relative shrink-0 w-full" data-name="Container">
      <Background />
      <Background1 />
    </div>
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[264px]"
      data-name="Container"
    >
      <Container1 />
      <Container2 />
      <Container5 />
      <Margin1 />
      <Container7 />
    </div>
  );
}

function Container9() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <RemixCover />
      <Container8 />
    </div>
  );
}

function Background2() {
  return (
    <div
      className="absolute bg-[#ff22fb] bottom-0 left-0 opacity-70 right-[60%] rounded-bl-[8px] rounded-tl-[8px] top-0"
      data-name="Background"
    />
  );
}

function UserAvatar() {
  return (
    <div
      className="absolute bg-no-repeat bg-size-[100%_100%] bg-top-left h-7 left-1/4 right-[67.05%] rounded-[14px] top-1/2 translate-y-[-50%]"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar}')` }}
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#0d1117] border-solid inset-0 pointer-events-none rounded-[14px]"
      />
    </div>
  );
}

function UserAvatar1() {
  return (
    <div
      className="absolute bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[14px] size-7 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="User Avatar"
      style={{ left: "calc(50% + 14px)", backgroundImage: `url('${imgUserAvatar1}')` }}
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#0d1117] border-solid inset-0 pointer-events-none rounded-[14px]"
      />
    </div>
  );
}

function UserAvatar2() {
  return (
    <div
      className="absolute bg-no-repeat bg-size-[100%_100%] bg-top-left h-7 left-3/4 right-[17.05%] rounded-[14px] top-1/2 translate-y-[-50%]"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar2}')` }}
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#0d1117] border-solid inset-0 pointer-events-none rounded-[14px]"
      />
    </div>
  );
}

function UserAvatar3() {
  return (
    <div
      className="absolute bg-no-repeat bg-size-[100%_100%] bg-top-left h-7 left-[10%] right-[82.05%] rounded-[14px] top-1/2 translate-y-[-50%]"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar3}')` }}
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#0d1117] border-solid inset-0 pointer-events-none rounded-[14px]"
      />
    </div>
  );
}

function UserAvatar4() {
  return (
    <div
      className="absolute bg-no-repeat bg-size-[100%_100%] bg-top-left h-7 left-[60%] right-[32.05%] rounded-[14px] top-1/2 translate-y-[-50%]"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar4}')` }}
    >
      <div
        aria-hidden="true"
        className="absolute border-2 border-[#0d1117] border-solid inset-0 pointer-events-none rounded-[14px]"
      />
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#161b22] h-[60px] overflow-clip relative rounded-lg shrink-0 w-full" data-name="Background">
      <Background2 />
      <UserAvatar />
      <UserAvatar1 />
      <UserAvatar2 />
      <UserAvatar3 />
      <UserAvatar4 />
    </div>
  );
}

function Container10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative self-stretch shrink-0 w-[88px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[26.17px]">
        <p className="block leading-[normal]">0:00</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative self-stretch shrink-0 w-[88px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[23.48px]">
        <p className="block leading-[normal]">1:00</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative self-stretch shrink-0 w-[88px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[25.92px]">
        <p className="block leading-[normal]">2:00</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-end justify-start p-0 relative self-stretch shrink-0 w-[88px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-right w-[26.02px]">
        <p className="block leading-[normal]">3:00</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container10 />
      <Container11 />
      <Container12 />
      <Container13 />
    </div>
  );
}

function Container15() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Background3 />
      <Container14 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.pe6d1980}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p1f8cd000}
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
      <Svg6 />
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-7" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="SVG">
          <path
            d={svgPaths.p27e17500}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[32px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)] shrink-0 size-16"
      data-name="Button"
    >
      <Svg7 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p66530a0}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p2c4ce380}
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

function Svg8() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group2 />
    </div>
  );
}

function Button5() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg8 />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Container17() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container15 />
      <Container16 />
    </div>
  );
}

function Margin2() {
  return (
    <div className="h-[25px] relative shrink-0 w-full" data-name="Margin">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col h-[25px] items-start justify-start pb-6 pt-0 px-6 relative w-full">
          <div className="bg-[#30363d] h-px shrink-0 w-full" data-name="Horizontal Divider" />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[111.48px]">
        <p className="block leading-[normal]">Track Details</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[78.52px]">
        <p className="block leading-[normal]">Release Date:</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[83.45px]">
        <p className="block leading-[normal]">2024-07-20</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-0.5 items-start justify-start left-0 p-0 right-[158px] top-0"
      data-name="Container"
    >
      <Container18 />
      <Container19 />
    </div>
  );
}

function Container21() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[38.34px]">
        <p className="block leading-[normal]">Genre:</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[118.89px]">
        <p className="block leading-[normal]">Electronic, House</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-0.5 items-start justify-start left-[158px] p-0 right-0 top-0"
      data-name="Container"
    >
      <Container21 />
      <Container22 />
    </div>
  );
}

function Container24() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[30.17px]">
        <p className="block leading-[normal]">BPM:</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[23.61px]">
        <p className="block leading-[normal]">128</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-0.5 items-start justify-start left-0 p-0 right-[158px] top-[46px]"
      data-name="Container"
    >
      <Container24 />
      <Container25 />
    </div>
  );
}

function Container27() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[25.14px]">
        <p className="block leading-[normal]">Key:</p>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[53.08px]">
        <p className="block leading-[normal]">C Minor</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-0.5 items-start justify-start left-[158px] p-0 right-0 top-[46px]"
      data-name="Container"
    >
      <Container27 />
      <Container28 />
    </div>
  );
}

function Container30() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[50.11px]">
        <p className="block leading-[normal]">Remixer:</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[55.48px]">
        <p className="block leading-[normal]">DJ Echo</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-0.5 items-start justify-start left-0 p-0 right-[158px] top-[92px]"
      data-name="Container"
    >
      <Container30 />
      <Container31 />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[126px] relative shrink-0 w-full" data-name="Container">
      <Container20 />
      <Container23 />
      <Container26 />
      <Container29 />
      <Container32 />
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 p-0 right-0 top-0"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[117.78px]">
        <p className="block leading-[normal]">Blockchain Info</p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p2110fac0}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.pef72ec0}
            id="Vector_2"
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

function Svg9() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Group3 />
    </div>
  );
}

function IconifyIcon5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg9 />
    </div>
  );
}

function Container34() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-[18.81px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[34px] justify-center leading-[normal] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[76.8px]">
        <p className="block mb-0">NFT</p>
        <p className="block">Ownership:</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-[26.53px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[34px] justify-center leading-[normal] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-left w-[45.02px]">
        <p className="block mb-0">Edition</p>
        <p className="block">#001</p>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p31ea7cc0}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p1758ac80}
            id="Vector_2"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg10() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group4 />
    </div>
  );
}

function IconifyIcon6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg10 />
    </div>
  );
}

function Button6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[14.72px] items-center justify-start pl-[11px] pr-[21.72px] py-[7px] relative rounded-md shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-md"
      />
      <IconifyIcon6 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[30px] justify-center leading-[normal] not-italic relative shrink-0 text-[#ff22fb] text-[12px] text-center w-[35.4px]">
        <p className="block mb-0">View</p>
        <p className="block">Wallet</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-2 h-11 items-center justify-start left-0 p-0 right-0 top-[32.06px]"
      data-name="Container"
    >
      <IconifyIcon5 />
      <Container34 />
      <Container35 />
      <Button6 />
    </div>
  );
}

function Svg11() {
  return (
    <div className="absolute inset-[3.13%_3.13%_-3.13%_-3.13%]" data-name="SVG">
      <div className="absolute bottom-[-2.45%] left-[-2.45%] right-[-8.34%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 17">
          <g id="SVG">
            <path
              d={svgPaths.p14481840}
              id="Vector"
              stroke="var(--stroke-0, #D29922)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.66667"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Svg12() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Svg11 />
    </div>
  );
}

function Container37() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-start justify-start p-0 relative shrink-0 w-[104px]"
      data-name="Container"
    >
      <Svg12 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-left w-[84px]">
        <p className="block leading-[normal]">Tip Creator</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-row items-center justify-center px-2.5 py-1.5 relative rounded-md shrink-0"
      data-name="Button"
    >
      <Container37 />
    </div>
  );
}

function Container38() {
  return (
    <div
      className="absolute aspect-[352/27] box-border content-stretch flex flex-row items-center justify-between left-[-46px] p-0 right-[-45px] top-[88.06px]"
      data-name="Container"
    >
      <Button7 />
    </div>
  );
}

function Container39() {
  return (
    <div className="h-[115px] relative shrink-0 w-full" data-name="Container">
      <Heading3 />
      <Container36 />
      <Container38 />
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[145.75px]">
        <p className="block leading-[normal]">Listening Statistics</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p9859980}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p368b1980}
            id="Vector_2"
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

function Svg13() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Group5 />
    </div>
  );
}

function IconifyIcon7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg13 />
    </div>
  );
}

function Container40() {
  return (
    <div
      className="absolute bottom-9 box-border content-stretch flex flex-row gap-1.5 items-center justify-start left-0 p-0 top-0"
      data-name="Container"
    >
      <IconifyIcon7 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[87.88px]">
        <p className="block leading-[normal]">35.8K Plays</p>
      </div>
    </div>
  );
}

function Svg14() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p2252abe0}
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

function IconifyIcon8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg14 />
    </div>
  );
}

function Container41() {
  return (
    <div
      className="absolute bottom-9 box-border content-stretch flex flex-row gap-1.5 items-center justify-start left-[125.88px] p-0 top-0"
      data-name="Container"
    >
      <IconifyIcon8 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[74.48px]">
        <p className="block leading-[normal]">1.2K Likes</p>
      </div>
    </div>
  );
}

function Svg15() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p24a12c00}
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

function IconifyIcon9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg15 />
    </div>
  );
}

function Container42() {
  return (
    <div
      className="absolute bottom-0 box-border content-stretch flex flex-row gap-1.5 items-center justify-start left-0 p-0 top-9"
      data-name="Container"
    >
      <IconifyIcon9 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[121.78px]">
        <p className="block leading-[normal]">250 Stars Gifted</p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p380b39c0}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p26518558}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p2a701480}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p1106b480}
            id="Vector_4"
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

function Svg16() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Group6 />
    </div>
  );
}

function IconifyIcon10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg16 />
    </div>
  );
}

function Container43() {
  return (
    <div
      className="absolute bottom-0 box-border content-stretch flex flex-row gap-1.5 items-center justify-start left-[159.78px] p-0 top-9"
      data-name="Container"
    >
      <IconifyIcon10 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-5 justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[76.84px]">
        <p className="block leading-[normal]">5 Remixes</p>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="h-14 relative shrink-0 w-full" data-name="Container">
      <Container40 />
      <Container41 />
      <Container42 />
      <Container43 />
    </div>
  );
}

function Container45() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading4 />
      <Container44 />
    </div>
  );
}

function Container46() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-5 pt-[14.94px] px-6 relative w-full">
          <Heading2 />
          <Container33 />
          <Container39 />
          <Container45 />
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[219.86px]">
        <p className="block leading-[normal]">{`Related Tracks & Remixes`}</p>
      </div>
    </div>
  );
}

function TrackCover() {
  return (
    <div
      className="bg-no-repeat bg-size-[133.33%_100%] bg-top rounded-lg shrink-0 size-12"
      data-name="Track Cover"
      style={{ backgroundImage: `url('${imgTrackCover}')` }}
    />
  );
}

function Container47() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[159.63px]">
        <p className="block leading-[normal]">Cosmic Echoes (Remix)</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[66.28px]">
        <p className="block leading-[normal]">By DJ Nova</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[196px]"
      data-name="Container"
    >
      <Container47 />
      <Container48 />
    </div>
  );
}

function Svg17() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p11ff3e80}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg17 />
    </div>
  );
}

function Background4() {
  return (
    <div className="bg-[#161b22] relative rounded-xl shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-[8px] relative w-full">
          <TrackCover />
          <Container49 />
          <Button8 />
        </div>
      </div>
    </div>
  );
}

function TrackCover1() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_150%] rounded-lg shrink-0 size-12"
      data-name="Track Cover"
      style={{ backgroundImage: `url('${imgTrackCover1}')` }}
    />
  );
}

function Container50() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[192.5px]">
        <p className="block leading-[normal]">Starlight Serenade (Original)</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[67.13px]">
        <p className="block leading-[normal]">By StarDust</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[196px]"
      data-name="Container"
    >
      <Container50 />
      <Container51 />
    </div>
  );
}

function Svg18() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p11ff3e80}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg18 />
    </div>
  );
}

function Background5() {
  return (
    <div className="bg-[#161b22] relative rounded-xl shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-[8px] relative w-full">
          <TrackCover1 />
          <Container52 />
          <Button9 />
        </div>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background4 />
      <Background5 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute left-0 size-[18px] top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Group">
          <path
            d={svgPaths.p1b130100}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p5f8c180}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p29ab6b00}
            id="Vector_3"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M11.1 11.1L15 15"
            id="Vector_4"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg19() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <Group7 />
    </div>
  );
}

function Button10() {
  return (
    <div className="bg-[#ff22fb] relative rounded-[10.5px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center pb-3 pt-4 px-5 relative w-full">
          <Svg19 />
          <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center w-[107.95px]">
            <p className="block leading-[normal]">Remix this track</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pt-[14.94px] px-6 relative w-full">
          <Heading5 />
          <Container53 />
          <Button10 />
        </div>
      </div>
    </div>
  );
}

function Heading6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[133.63px]">
        <p className="block leading-[normal]">Comments (89)</p>
      </div>
    </div>
  );
}

function Container55() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-left w-[116.58px]">
        <p className="block leading-[normal]">Add a comment...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-start justify-start overflow-clip px-3 py-2.5 relative rounded-[7px] shrink-0 w-[178px]"
      data-name="Input"
    >
      <Container55 />
    </div>
  );
}

function Container56() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-center w-[30.53px]">
        <p className="block leading-[normal]">0:00</p>
      </div>
    </div>
  );
}

function Input1() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-start justify-start overflow-clip px-2 py-2.5 relative rounded-[7px] shrink-0 w-[60px]"
      data-name="Input"
    >
      <Container56 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute left-0 size-[18px] top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Group">
          <path
            d={svgPaths.p171c0f80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p17299b00}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg20() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <Group8 />
    </div>
  );
}

function Button11() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg20 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute left-0 size-[18px] top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Group">
          <path
            d={svgPaths.p32328880}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p229b6000}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p249e71e0}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg21() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <Group9 />
    </div>
  );
}

function Button12() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg21 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute left-0 size-[18px] top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Group">
          <path
            d={svgPaths.p13616da0}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p18e6af80}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg22() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <Group10 />
    </div>
  );
}

function Button13() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg22 />
    </div>
  );
}

function Svg23() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path
            d={svgPaths.p2bc96b40}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

function Button14() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-row items-center justify-center px-4 py-2.5 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <Svg23 />
    </div>
  );
}

function Container57() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-[249px]"
      data-name="Container"
    >
      <Input />
      <Input1 />
      <Button11 />
      <Button12 />
      <Button13 />
      <Button14 />
    </div>
  );
}

function UserAvatar5() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[18px] shrink-0 size-9"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar}')` }}
    />
  );
}

function Container58() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[63.22px]">
        <p className="block leading-[normal]">30 sec ago</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff22fb] text-[12px] text-left w-[42.09px]">
        <p className="block leading-[normal]">@ 0:45</p>
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-2 items-center justify-start left-0 p-0 right-0 top-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[86.75px]">
        <p className="block leading-[normal]">GrooveLover</p>
      </div>
      <Container58 />
      <Container59 />
    </div>
  );
}

function Container61() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 p-0 right-0 top-[20.3px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-10 justify-center leading-[19.6px] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[229.97px]">
        <p className="block mb-0">Anyone else getting major summer</p>
        <p className="block">vibes from this? ☀️</p>
      </div>
    </div>
  );
}

function Svg24() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p3edfaf80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg24 />
    </div>
  );
}

function Button15() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon11 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[7.41px]">
        <p className="block leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p24165f80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.pc562a00}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg25() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group11 />
    </div>
  );
}

function IconifyIcon12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg25 />
    </div>
  );
}

function Button16() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon12 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[32.09px]">
        <p className="block leading-[normal]">Reply</p>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p18cc6000}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p235f3680}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg26() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group12 />
    </div>
  );
}

function IconifyIcon13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg26 />
    </div>
  );
}

function Button17() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon13 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[69.22px]">
        <p className="block leading-[normal]">Audio React</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button15 />
      <Button16 />
      <Button17 />
    </div>
  );
}

function Margin5() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-1 px-0 right-0 top-[64.18px]"
      data-name="Margin"
    >
      <Container62 />
    </div>
  );
}

function Container63() {
  return (
    <div className="relative self-stretch shrink-0 w-64" data-name="Container">
      <Container60 />
      <Container61 />
      <Margin5 />
    </div>
  );
}

function Container64() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <UserAvatar5 />
      <Container63 />
    </div>
  );
}

function Container65() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container64 />
    </div>
  );
}

function Container66() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-[0.01px] pt-[14.93px] px-6 relative w-full">
          <Heading6 />
          <Container57 />
          <Container65 />
        </div>
      </div>
    </div>
  );
}

function Container67() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-6 items-start justify-start left-0 px-6 py-0 right-0 top-[88px]"
      data-name="Container"
    >
      <Container9 />
      <Container17 />
      <Margin2 />
      <Container46 />
      <Margin2 />
      <Container54 />
      <Margin2 />
      <Container66 />
    </div>
  );
}

function UserAvatar6() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[18px] shrink-0 size-9"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar1}')` }}
    />
  );
}

function Container68() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[55.88px]">
        <p className="block leading-[normal]">2 min ago</p>
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff22fb] text-[12px] text-left w-[39.47px]">
        <p className="block leading-[normal]">@ 1:30</p>
      </div>
    </div>
  );
}

function Container70() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-2 items-center justify-start left-0 p-0 right-0 top-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[90.38px]">
        <p className="block leading-[normal]">MusicFanatic</p>
      </div>
      <Container68 />
      <Container69 />
    </div>
  );
}

function Container71() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 p-0 right-0 top-[20.3px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-10 justify-center leading-[19.6px] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[231.98px]">
        <p className="block mb-0">This remix is pure energy! Love the</p>
        <p className="block">drop at 1:30. 🔥</p>
      </div>
    </div>
  );
}

function Svg27() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p3edfaf80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon14() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg27 />
    </div>
  );
}

function Button18() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon14 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[7.25px]">
        <p className="block leading-[normal]">5</p>
      </div>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p24165f80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.pc562a00}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg28() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group13 />
    </div>
  );
}

function IconifyIcon15() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg28 />
    </div>
  );
}

function Button19() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon15 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[32.09px]">
        <p className="block leading-[normal]">Reply</p>
      </div>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p18cc6000}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p235f3680}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg29() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group14 />
    </div>
  );
}

function IconifyIcon16() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg29 />
    </div>
  );
}

function Button20() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon16 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[69.22px]">
        <p className="block leading-[normal]">Audio React</p>
      </div>
    </div>
  );
}

function Container72() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button18 />
      <Button19 />
      <Button20 />
    </div>
  );
}

function Margin6() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-1 px-0 right-0 top-[64.19px]"
      data-name="Margin"
    >
      <Container72 />
    </div>
  );
}

function UserAvatar7() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[18px] shrink-0 size-9"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar5}')` }}
    />
  );
}

function Container73() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-[21.31px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[30px] justify-center leading-[normal] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[28.77px]">
        <p className="block mb-0">1 min</p>
        <p className="block">ago</p>
      </div>
    </div>
  );
}

function Container74() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-[12.58px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[30px] justify-center leading-[normal] not-italic relative shrink-0 text-[#ff22fb] text-[12px] text-left w-[23.89px]">
        <p className="block mb-0">@</p>
        <p className="block">1:35</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-2 items-center justify-start left-0 p-0 right-0 top-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[79.45px]">
        <p className="block leading-[normal]">RemixLover</p>
      </div>
      <Container73 />
      <Container74 />
    </div>
  );
}

function Container76() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 p-0 right-0 top-[33.3px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-10 justify-center leading-[19.6px] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[177.27px]">
        <p className="block mb-0">Totally agree! The bassline</p>
        <p className="block">is insane here.</p>
      </div>
    </div>
  );
}

function Svg30() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p3edfaf80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon17() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg30 />
    </div>
  );
}

function Button21() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon17 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[7.41px]">
        <p className="block leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p24165f80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.pc562a00}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg31() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group15 />
    </div>
  );
}

function IconifyIcon18() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg31 />
    </div>
  );
}

function Button22() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon18 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[32.09px]">
        <p className="block leading-[normal]">Reply</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button21 />
      <Button22 />
    </div>
  );
}

function Margin7() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-1 px-0 right-0 top-[77.19px]"
      data-name="Margin"
    >
      <Container77 />
    </div>
  );
}

function Container78() {
  return (
    <div className="relative self-stretch shrink-0 w-[182px]" data-name="Container">
      <Container75 />
      <Container76 />
      <Margin7 />
    </div>
  );
}

function Container79() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <UserAvatar7 />
      <Container78 />
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="relative shrink-0 w-full" data-name="VerticalBorder">
      <div
        aria-hidden="true"
        className="absolute border-[#30363d] border-[0px_0px_0px_2px] border-solid inset-0 pointer-events-none"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start pb-0 pl-[26px] pr-0 pt-3 relative w-full">
          <Container79 />
        </div>
      </div>
    </div>
  );
}

function Margin8() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-3 px-0 right-0 top-[87.19px]"
      data-name="Margin"
    >
      <VerticalBorder />
    </div>
  );
}

function Container80() {
  return (
    <div className="relative self-stretch shrink-0 w-64" data-name="Container">
      <Container70 />
      <Container71 />
      <Margin6 />
      <Margin8 />
    </div>
  );
}

function Container81() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-3 items-start justify-start left-12 p-0 top-[1621px] w-[352px]"
      data-name="Container"
    >
      <UserAvatar6 />
      <Container80 />
    </div>
  );
}

function UserAvatar8() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[18px] shrink-0 size-9"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar2}')` }}
    />
  );
}

function Group16() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p3dbe3700}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p24f94f00}
            id="Vector_2"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg32() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group16 />
    </div>
  );
}

function IconifyIcon19() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg32 />
    </div>
  );
}

function Container82() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff22fb] text-[14px] text-left w-[55.48px]">
        <p className="block leading-[normal]">DJ Echo</p>
      </div>
      <IconifyIcon19 />
    </div>
  );
}

function Container83() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[53.44px]">
        <p className="block leading-[normal]">1 min ago</p>
      </div>
    </div>
  );
}

function Container84() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#ff22fb] text-[12px] text-left w-[38.75px]">
        <p className="block leading-[normal]">@ 2:15</p>
      </div>
    </div>
  );
}

function Container85() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-2 items-center justify-start left-0 p-0 right-0 top-0"
      data-name="Container"
    >
      <Container82 />
      <Container83 />
      <Container84 />
    </div>
  );
}

function Container86() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 p-0 right-0 top-[20.3px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-10 justify-center leading-[19.6px] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[246.27px]">
        <p className="block mb-0">Thanks @MusicFanatic! Glad you like</p>
        <p className="block">it! That drop took a while to perfect. 😉</p>
      </div>
    </div>
  );
}

function Svg33() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p3edfaf80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon20() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg33 />
    </div>
  );
}

function Button23() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon20 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[12.73px]">
        <p className="block leading-[normal]">10</p>
      </div>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p24165f80}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.pc562a00}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg34() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group17 />
    </div>
  );
}

function IconifyIcon21() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg34 />
    </div>
  );
}

function Button24() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon21 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[32.09px]">
        <p className="block leading-[normal]">Reply</p>
      </div>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p18cc6000}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p235f3680}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg35() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group18 />
    </div>
  );
}

function IconifyIcon22() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg35 />
    </div>
  );
}

function Button25() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon22 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[69.22px]">
        <p className="block leading-[normal]">Audio React</p>
      </div>
    </div>
  );
}

function Container87() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button23 />
      <Button24 />
      <Button25 />
    </div>
  );
}

function Margin9() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-0 pt-1 px-0 right-0 top-[64.19px]"
      data-name="Margin"
    >
      <Container87 />
    </div>
  );
}

function Container88() {
  return (
    <div className="h-full relative shrink-0 w-64" data-name="Container">
      <Container85 />
      <Container86 />
      <Margin9 />
    </div>
  );
}

function Container89() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-3 h-[100px] items-start justify-start left-12 p-0 top-[1849px] w-[352px]"
      data-name="Container"
    >
      <UserAvatar8 />
      <Container88 />
    </div>
  );
}

function Background6() {
  return (
    <div
      className="bg-[#161b22] h-[2007px] overflow-clip relative rounded-2xl shrink-0 w-[448px]"
      data-name="Background"
    >
      <Container />
      <Margin />
      <Container67 />
      <Container81 />
      <Container89 />
    </div>
  );
}

export default function RemixDetail() {
  return (
    <div className="bg-[#0d1117] relative size-full" data-name="Remix Detail">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-start justify-center p-[20px] relative size-full">
          <Background6 />
        </div>
      </div>
    </div>
  );
}