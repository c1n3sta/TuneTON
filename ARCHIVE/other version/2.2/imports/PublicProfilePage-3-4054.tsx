import svgPaths from "./svg-ty8h9m23bx";
import imgUserAvatar from "figma:asset/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png";
import imgRemixThumbnail from "figma:asset/9131a8d559e61759624112848c7efd789a821304.png";
import imgRemixThumbnail1 from "figma:asset/9b70de60c9c6fca835689966d784c1342e0cae63.png";
import imgRemixThumbnail2 from "figma:asset/32f8c11f6ddbee1a59d210d5725d72775f8b4e07.png";

function Svg() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path
            d="M15 18L9 12L15 6"
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

function Paragraph() {
  return (
    <div
      className="box-border content-stretch flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold gap-1 items-center justify-start leading-[0] p-0 relative shrink-0 text-center w-[304px]"
      data-name="Paragraph"
    >
      <div className="flex flex-col h-10 justify-center relative shrink-0 text-[#c9d1d9] text-[18px] w-[126px]">
        <p className="block leading-[normal]">DJ BeatMaster</p>
      </div>
      <div className="flex flex-col h-[15px] justify-center relative shrink-0 text-[#8b949e] text-[12px] w-[182px]">
        <p className="block leading-[normal]">Remixer Profile</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p1e6d7f00}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.pdce5d00}
            id="Vector_2"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p3d769800}
            id="Vector_3"
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

function Svg1() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group />
    </div>
  );
}

function Button1() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg1 />
    </div>
  );
}

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button />
      <Paragraph />
      <Button1 />
    </div>
  );
}

function UserAvatar() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[48px] shrink-0 size-24"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar}')` }}
    />
  );
}

function Button2() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-6 py-2 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center w-[43.09px]">
        <p className="block leading-[normal]">Follow</p>
      </div>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0"
      data-name="Button:margin"
    >
      <Button2 />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-center w-[27.13px]">
        <p className="block leading-[normal]">120</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <Container1 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center tracking-[0.6px] uppercase w-[56.3px]">
        <p className="adjustLetterSpacing block leading-[normal]">REMIXES</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-center w-[35.44px]">
        <p className="block leading-[normal]">5.2K</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <Container3 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center tracking-[0.6px] uppercase w-[78.53px]">
        <p className="adjustLetterSpacing block leading-[normal]">FOLLOWERS</p>
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
            d={svgPaths.p1fa08bc0}
            id="Vector"
            stroke="var(--stroke-0, #D29922)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg2 />
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-center w-[24.83px]">
        <p className="block leading-[normal]">4.8</p>
      </div>
      <IconifyIcon />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <Container5 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center tracking-[0.6px] uppercase w-[81.67px]">
        <p className="adjustLetterSpacing block leading-[normal]">AVG. RATING</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-[45.1px] items-start justify-start pl-[22.58px] pr-[22.61px] py-0 relative shrink-0"
      data-name="Container"
    >
      <Container2 />
      <Container4 />
      <Container6 />
    </div>
  );
}

function Margin() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-2 px-0 relative shrink-0"
      data-name="Margin"
    >
      <Container7 />
    </div>
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <UserAvatar />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-6 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[20px] text-center w-[140px]">
        <p className="block leading-[normal]">DJ BeatMaster</p>
      </div>
      <ButtonMargin />
      <Margin />
    </div>
  );
}

function Button3() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-col items-center justify-center px-4 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#dffcf8] text-[12px] text-center w-[48.28px]">
        <p className="block leading-[normal]">Remixes</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div
      className="bg-[#484f58] box-border content-stretch flex flex-col items-center justify-center px-4 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[34.48px]">
        <p className="block leading-[normal]">About</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div
      className="bg-[#484f58] box-border content-stretch flex flex-col items-center justify-center px-4 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[29.16px]">
        <p className="block leading-[normal]">Stats</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function RemixThumbnail() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[150%_100%,auto] rounded-lg shrink-0 size-16"
      data-name="Remix Thumbnail"
      style={{ backgroundImage: `url('${imgRemixThumbnail}')` }}
    />
  );
}

function Container10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[257.47px]">
        <p className="block leading-[normal]">Summer Vibes (DJ BeatMaster Remix)</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[106.06px]">
        <p className="block leading-[normal]">Original by Artist A</p>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p36dbe280}
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
      <Svg3 />
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p863ae00}
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

function IconifyIcon2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg4 />
    </div>
  );
}

function Container12() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <IconifyIcon1 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[26.14px]">
        <p className="block leading-[normal]">1.5M</p>
      </div>
      <IconifyIcon2 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[22.5px]">
        <p className="block leading-[normal]">25K</p>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container12 />
    </div>
  );
}

function Container13() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[276px]"
      data-name="Container"
    >
      <Container10 />
      <Container11 />
      <Margin1 />
    </div>
  );
}

function Container14() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Container"
    >
      <RemixThumbnail />
      <Container13 />
    </div>
  );
}

function RemixThumbnail1() {
  return (
    <div
      className="bg-[#484f58] bg-[position:0%_50%,_0%_0%] bg-size-[100%_133.33%,auto] rounded-lg shrink-0 size-16"
      data-name="Remix Thumbnail"
      style={{ backgroundImage: `url('${imgRemixThumbnail1}')` }}
    />
  );
}

function Container15() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[231.06px]">
        <p className="block leading-[normal]">City Lights (DJ BeatMaster Remix)</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[105.64px]">
        <p className="block leading-[normal]">Original by Artist B</p>
      </div>
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p36dbe280}
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

function IconifyIcon3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg5 />
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p863ae00}
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

function IconifyIcon4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg6 />
    </div>
  );
}

function Container17() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <IconifyIcon3 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[30.5px]">
        <p className="block leading-[normal]">980K</p>
      </div>
      <IconifyIcon4 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[20.38px]">
        <p className="block leading-[normal]">18K</p>
      </div>
    </div>
  );
}

function Margin2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container17 />
    </div>
  );
}

function Container18() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[276px]"
      data-name="Container"
    >
      <Container15 />
      <Container16 />
      <Margin2 />
    </div>
  );
}

function Container19() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Container"
    >
      <RemixThumbnail1 />
      <Container18 />
    </div>
  );
}

function RemixThumbnail2() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[128.42%_100%,auto] rounded-lg shrink-0 size-16"
      data-name="Remix Thumbnail"
      style={{ backgroundImage: `url('${imgRemixThumbnail2}')` }}
    />
  );
}

function Container20() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[270.77px]">
        <p className="block leading-[normal]">Midnight Groove (DJ BeatMaster Remix)</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[106.55px]">
        <p className="block leading-[normal]">Original by Artist C</p>
      </div>
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p36dbe280}
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

function IconifyIcon5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg7 />
    </div>
  );
}

function Svg8() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p863ae00}
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

function IconifyIcon6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg8 />
    </div>
  );
}

function Container22() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <IconifyIcon5 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[29.75px]">
        <p className="block leading-[normal]">720K</p>
      </div>
      <IconifyIcon6 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[20.27px]">
        <p className="block leading-[normal]">12K</p>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container22 />
    </div>
  );
}

function Container23() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[276px]"
      data-name="Container"
    >
      <Container20 />
      <Container21 />
      <Margin3 />
    </div>
  );
}

function Container24() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-0 py-2 relative shrink-0 w-full"
      data-name="Container"
    >
      <RemixThumbnail2 />
      <Container23 />
    </div>
  );
}

function Container25() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container14 />
      <Container19 />
      <Container24 />
    </div>
  );
}

function Background() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-5 h-[856px] items-start justify-start overflow-clip pb-[21px] pt-6 px-6 relative rounded-2xl shrink-0 w-[400px]"
      data-name="Background"
    >
      <Container />
      <Container8 />
      <Container9 />
      <Container25 />
    </div>
  );
}

export default function PublicProfilePage() {
  return (
    <div className="bg-[#0d1117] relative size-full" data-name="Public  profile page">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-start justify-center p-[20px] relative size-full">
          <Background />
        </div>
      </div>
    </div>
  );
}