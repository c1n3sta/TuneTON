import svgPaths from "./svg-y4v2h8u2eh";

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

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[18px] text-center w-[70.86px]">
        <p className="block leading-[normal]">Settings</p>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pl-0 pr-10 py-0 relative shrink-0 w-[312px]"
      data-name="Margin"
    >
      <Container />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-4 items-center justify-start left-6 p-0 right-6 top-6"
      data-name="Container"
    >
      <Button />
      <Margin />
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[64.61px]">
        <p className="block leading-[normal]">Account</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p39eeeea0}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p2fb3cc00}
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

function Svg1() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
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

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[72.34px]">
        <p className="block leading-[normal]">Edit Profile</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon />
      <Container2 />
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            id="Vector"
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

function Button1() {
  return (
    <div
      className="bg-[#0d1117] box-border content-stretch flex flex-row items-center justify-between p-[13px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-[6.67px]"
      />
      <Container3 />
      <IconifyIcon1 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p2c061400}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p24df41c0}
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
      <Group1 />
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

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[121.28px]">
        <p className="block leading-[normal]">Change Password</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon2 />
      <Container4 />
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            id="Vector"
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
      className="bg-[#0d1117] box-border content-stretch flex flex-row items-center justify-between p-[13px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-[6.67px]"
      />
      <Container5 />
      <IconifyIcon3 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p211c4140}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p386c0c00}
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

function Svg5() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group2 />
    </div>
  );
}

function IconifyIcon4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg5 />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[111.45px]">
        <p className="block leading-[normal]">Linked Accounts</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon4 />
      <Container6 />
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            id="Vector"
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

function IconifyIcon5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg6 />
    </div>
  );
}

function Button3() {
  return (
    <div
      className="bg-[#0d1117] box-border content-stretch flex flex-row items-center justify-between p-[13px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-[6.67px]"
      />
      <Container7 />
      <IconifyIcon5 />
    </div>
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading3 />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[128.69px]">
        <p className="block leading-[normal]">App Preferences</p>
      </div>
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p36b58680}
            id="Vector"
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

function IconifyIcon6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg7 />
    </div>
  );
}

function Container9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[85.09px]">
        <p className="block leading-[normal]">Notifications</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon6 />
      <Container9 />
    </div>
  );
}

function Svg8() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            id="Vector"
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

function IconifyIcon7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg8 />
    </div>
  );
}

function Button4() {
  return (
    <div
      className="bg-[#0d1117] box-border content-stretch flex flex-row items-center justify-between p-[13px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-[6.67px]"
      />
      <Container10 />
      <IconifyIcon7 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p2c37b900}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <g id="Vector_2">
            <path d={svgPaths.p3e9083a0} fill="var(--fill-0, #8B949E)" />
            <path
              d={svgPaths.p3e9083a0}
              stroke="var(--stroke-0, #8B949E)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.66667"
            />
          </g>
          <g id="Vector_3">
            <path d={svgPaths.p15802780} fill="var(--fill-0, #8B949E)" />
            <path
              d={svgPaths.p15802780}
              stroke="var(--stroke-0, #8B949E)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.66667"
            />
          </g>
          <g id="Vector_4">
            <path d={svgPaths.p3e8b370} fill="var(--fill-0, #8B949E)" />
            <path
              d={svgPaths.p3e8b370}
              stroke="var(--stroke-0, #8B949E)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.66667"
            />
          </g>
          <g id="Vector_5">
            <path d={svgPaths.p3c3b4800} fill="var(--fill-0, #8B949E)" />
            <path
              d={svgPaths.p3c3b4800}
              stroke="var(--stroke-0, #8B949E)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.66667"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group3 />
    </div>
  );
}

function IconifyIcon8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg9 />
    </div>
  );
}

function Container11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[46.45px]">
        <p className="block leading-[normal]">Theme</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon8 />
      <Container11 />
    </div>
  );
}

function Svg10() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            id="Vector"
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

function IconifyIcon9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg10 />
    </div>
  );
}

function Button5() {
  return (
    <div
      className="bg-[#0d1117] box-border content-stretch flex flex-row items-center justify-between p-[13px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-[6.67px]"
      />
      <Container12 />
      <IconifyIcon9 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p3d0e3a90}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p1c59aa00}
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

function Svg11() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group4 />
    </div>
  );
}

function IconifyIcon10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg11 />
    </div>
  );
}

function Container13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[66.23px]">
        <p className="block leading-[normal]">Language</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon10 />
      <Container13 />
    </div>
  );
}

function Svg12() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            id="Vector"
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

function IconifyIcon11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg12 />
    </div>
  );
}

function Button6() {
  return (
    <div
      className="bg-[#0d1117] box-border content-stretch flex flex-row items-center justify-between p-[13px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-[6.67px]"
      />
      <Container14 />
      <IconifyIcon11 />
    </div>
  );
}

function Container15() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading4 />
      <Button4 />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[61.86px]">
        <p className="block leading-[normal]">Support</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p3d0e3a90}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p13a900}
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

function Svg13() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group5 />
    </div>
  );
}

function IconifyIcon12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg13 />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[79.75px]">
        <p className="block leading-[normal]">Help Center</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon12 />
      <Container16 />
    </div>
  );
}

function Svg14() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            id="Vector"
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

function IconifyIcon13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg14 />
    </div>
  );
}

function Button7() {
  return (
    <div
      className="bg-[#0d1117] box-border content-stretch flex flex-row items-center justify-between p-[13px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-[6.67px]"
      />
      <Container17 />
      <IconifyIcon13 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p35f52380}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p98cdb00}
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

function Svg15() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group6 />
    </div>
  );
}

function IconifyIcon14() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg15 />
    </div>
  );
}

function Container18() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[74.42px]">
        <p className="block leading-[normal]">Contact Us</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon14 />
      <Container18 />
    </div>
  );
}

function Svg16() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            id="Vector"
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

function IconifyIcon15() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg16 />
    </div>
  );
}

function Button8() {
  return (
    <div
      className="bg-[#0d1117] box-border content-stretch flex flex-row items-center justify-between p-[13px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-[6.67px]"
      />
      <Container19 />
      <IconifyIcon15 />
    </div>
  );
}

function Svg17() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p6852400}
            id="Vector"
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

function IconifyIcon16() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg17 />
    </div>
  );
}

function Container20() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[93.81px]">
        <p className="block leading-[normal]">Privacy Policy</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon16 />
      <Container20 />
    </div>
  );
}

function Svg18() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d="M7.5 15L12.5 10L7.5 5"
            id="Vector"
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

function IconifyIcon17() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg18 />
    </div>
  );
}

function Button9() {
  return (
    <div
      className="bg-[#0d1117] box-border content-stretch flex flex-row items-center justify-between p-[13px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-[6.67px]"
      />
      <Container21 />
      <IconifyIcon17 />
    </div>
  );
}

function Container22() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading5 />
      <Button7 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function Container23() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-6 items-start justify-start left-6 p-0 right-6 top-[72px]"
      data-name="Container"
    >
      <Container8 />
      <Container15 />
      <Container22 />
    </div>
  );
}

function Svg19() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p234c7380}
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

function Button10() {
  return (
    <div className="bg-[#d73a49] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-5 py-3 relative w-full">
          <Svg19 />
          <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center w-[52.7px]">
            <p className="block leading-[normal]">Log Out</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div
      className="absolute bottom-[26px] box-border content-stretch flex flex-col items-start justify-start left-6 pb-0 pt-2 px-0 right-6"
      data-name="Button:margin"
    >
      <Button10 />
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[206px]">
        <p className="block leading-[normal]">Privacy Controls</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-6 p-0 right-6 top-[734px]"
      data-name="Container"
    >
      <Heading2 />
    </div>
  );
}

function Container25() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[141.03px]">
        <p className="block leading-[normal]">Show Playlist Activity</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="absolute bg-[#ff22fb] inset-0 rounded-3xl" data-name="Background">
      <div className="absolute bg-[#ffffff] bottom-1 left-5 rounded-lg size-4" data-name="Background" />
    </div>
  );
}

function Label() {
  return (
    <div className="h-6 relative shrink-0 w-10" data-name="Label">
      <Background />
    </div>
  );
}

function Container26() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container25 />
      <Label />
    </div>
  );
}

function Container27() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[154.17px]">
        <p className="block leading-[normal]">Show Listening Activity</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="absolute bg-[#8b949e] inset-0 rounded-3xl" data-name="Background">
      <div className="absolute bg-[#ffffff] bottom-1 left-1 rounded-lg size-4" data-name="Background" />
    </div>
  );
}

function Label1() {
  return (
    <div className="h-6 relative shrink-0 w-10" data-name="Label">
      <Background1 />
    </div>
  );
}

function Container28() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container27 />
      <Label1 />
    </div>
  );
}

function Background2() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-3 items-start justify-start left-6 p-[16px] right-6 rounded-lg top-[774px]"
      data-name="Background"
    >
      <Container26 />
      <Container28 />
    </div>
  );
}

function Background3() {
  return (
    <div
      className="bg-[#161b22] h-[974px] mr-[-24px] overflow-clip relative rounded-2xl shrink-0 w-[400px]"
      data-name="Background"
    >
      <Container1 />
      <Container23 />
      <ButtonMargin />
      <Container24 />
      <Background2 />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="bg-[#0d1117] relative size-full" data-name="Settings page">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-start justify-center pl-5 pr-11 py-5 relative size-full">
          <Background3 />
        </div>
      </div>
    </div>
  );
}