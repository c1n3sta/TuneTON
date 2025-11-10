import svgPaths from "./svg-n5jrz1crdo";
import imgUserAvatar from "figma:asset/02641910bdc93d1d98cf6da313c9fe42f75a5679.png";
import imgNft from "figma:asset/6aa1bca09cfd5686a63ce1963cf201a63c1d873d.png";
import imgNft1 from "figma:asset/8cb97999a364792fa2b921da0476d4b3c463d5bd.png";
import imgNft2 from "figma:asset/2da314c036af7e34d758806293d6755224f3ee49.png";
import imgTrackCover from "figma:asset/5f2e6cf5ce46e8c46e99ccb52801bd492da3929d.png";
import imgTrackCover1 from "figma:asset/cb5e6abbe13fd21efcd0485f3f8147c3aa3b3aa8.png";

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[21px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[147.08px]">
        <p className="block leading-[normal]">{`Profile & Settings`}</p>
      </div>
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path
            d={svgPaths.p1caa700}
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

function Group() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p7341e80}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p2777f880}
            id="Vector_2"
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

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Button />
      <Button1 />
    </div>
  );
}

function Container2() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-between left-6 p-0 right-6 top-6"
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
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[40px] shrink-0 size-20"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar}')` }}
    />
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-48"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-center w-full">
        <p className="block leading-[normal]">Alex Johnson</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-[170px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-center w-full">
        <p className="block leading-[normal]">@alexj_music</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container3 />
      <Container4 />
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path
            d={svgPaths.pd2b6e00}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

function IconifyIcon() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0 w-[22px]"
      data-name="iconify-icon"
    >
      <Svg2 />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 w-[120px]"
      data-name="Button"
    >
      <IconifyIcon />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[90px]">
        <p className="block leading-[normal]">Edit Profile</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-3 items-center justify-start left-6 p-[20px] right-6 rounded-lg top-[68px]"
      data-name="Background"
    >
      <UserAvatar />
      <Container5 />
      <Button2 />
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[90.56px]">
        <p className="block leading-[normal]">NFT Gallery</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[53.77px]">
        <p className="block leading-[normal]">View All</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-between left-6 p-0 right-6 top-[291px]"
      data-name="Container"
    >
      <Heading2 />
      <Button3 />
    </div>
  );
}

function Nft() {
  return (
    <div
      className="bg-[#484f58] bg-[position:0%_50%,_0%_0%] bg-size-[100%_129.63%,auto] h-[90px] rounded-lg shrink-0 w-[93.33px]"
      data-name="NFT"
      style={{ backgroundImage: `url('${imgNft}')` }}
    />
  );
}

function Container7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[12px] text-center w-[96.47px]">
        <p className="block leading-[normal]">Groove Guardian</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[109.33px]"
      data-name="Background"
    >
      <Nft />
      <Container7 />
    </div>
  );
}

function Nft1() {
  return (
    <div
      className="bg-[#484f58] bg-[position:0%_50%,_0%_0%] bg-size-[100%_122.14%,auto] h-[90px] rounded-lg shrink-0 w-[93.33px]"
      data-name="NFT"
      style={{ backgroundImage: `url('${imgNft1}')` }}
    />
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[12px] text-center w-[76.98px]">
        <p className="block leading-[normal]">Rhythm Rider</p>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[109.33px]"
      data-name="Background"
    >
      <Nft1 />
      <Container8 />
    </div>
  );
}

function Nft2() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[144.43%_100%,auto] h-[90px] rounded-lg shrink-0 w-[93.34px]"
      data-name="NFT"
      style={{ backgroundImage: `url('${imgNft2}')` }}
    />
  );
}

function Container9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[12px] text-center w-[89.55px]">
        <p className="block leading-[normal]">Sound Sorcerer</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[109.34px]"
      data-name="Background"
    >
      <Nft2 />
      <Container9 />
    </div>
  );
}

function Container10() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row gap-3 items-start justify-center left-6 p-0 right-6 top-[331px]"
      data-name="Container"
    >
      <Background1 />
      <Background2 />
      <Background3 />
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[97.03px]">
        <p className="block leading-[normal]">Your Badges</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[53.77px]">
        <p className="block leading-[normal]">View All</p>
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-between left-6 p-0 right-6 top-[480px]"
      data-name="Container"
    >
      <Heading3 />
      <Button4 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute left-0 size-7 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="Group">
          <path
            d={svgPaths.p30860120}
            id="Vector"
            stroke="var(--stroke-0, #D29922)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
          <path
            d={svgPaths.pe723a00}
            id="Vector_2"
            stroke="var(--stroke-0, #D29922)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-7" data-name="SVG">
      <Group1 />
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

function Container12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[94.14px]">
        <p className="block leading-[normal]">Top Remixer</p>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div
      className="absolute bg-[#484f58] bottom-[60px] box-border content-stretch flex flex-row gap-2.5 items-center justify-start left-0 px-4 py-2.5 rounded-xl top-0"
      data-name="Background"
    >
      <IconifyIcon1 />
      <Container12 />
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-7" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="SVG">
          <path
            d={svgPaths.pce8aa00}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
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

function Container13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[83.88px]">
        <p className="block leading-[normal]">Playlist Pro</p>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div
      className="absolute bg-[#484f58] bottom-[60px] box-border content-stretch flex flex-row gap-2.5 items-center justify-start left-[176.14px] px-4 py-2.5 rounded-xl top-0"
      data-name="Background"
    >
      <IconifyIcon2 />
      <Container13 />
    </div>
  );
}

function Svg5() {
  return (
    <div className="relative shrink-0 size-7" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="SVG">
          <path
            d={svgPaths.pe6b2c00}
            id="Vector"
            stroke="var(--stroke-0, #2EA043)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
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

function Container14() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[102.97px]">
        <p className="block leading-[normal]">Daily Listener</p>
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div
      className="absolute bg-[#484f58] bottom-0 box-border content-stretch flex flex-row gap-2.5 items-center justify-start left-0 px-4 py-2.5 rounded-xl top-[60px]"
      data-name="Background"
    >
      <IconifyIcon3 />
      <Container14 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute h-[108px] left-6 right-6 top-[520px]" data-name="Container">
      <Background4 />
      <Background5 />
      <Background6 />
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[146.3px]">
        <p className="block leading-[normal]">Listening Analytics</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[45.72px]">
        <p className="block leading-[normal]">Details</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-between left-6 p-0 right-6 top-[648px]"
      data-name="Container"
    >
      <Heading4 />
      <Button5 />
    </div>
  );
}

function Container17() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[16px] text-left w-[55.83px]">
        <p className="block leading-[normal]">120 hrs</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container17 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[82.3px]">
        <p className="block leading-[normal]">Total Listening</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[16px] text-left w-[29.73px]">
        <p className="block leading-[normal]">Pop</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container19 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[59.09px]">
        <p className="block leading-[normal]">Top Genre</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[16px] text-left w-[16.47px]">
        <p className="block leading-[normal]">15</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container21 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[96.05px]">
        <p className="block leading-[normal]">Remixes Created</p>
      </div>
    </div>
  );
}

function Background7() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-row gap-[27.5px] items-center justify-start left-6 pl-[29.75px] pr-[29.78px] py-4 right-6 rounded-lg top-[688px]"
      data-name="Background"
    >
      <Container18 />
      <Container20 />
      <Container22 />
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[112.11px]">
        <p className="block leading-[normal]">Hottest Tracks</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[53.77px]">
        <p className="block leading-[normal]">View All</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-between left-6 p-0 right-6 top-[779px]"
      data-name="Container"
    >
      <Heading5 />
      <Button6 />
    </div>
  );
}

function TrackCover() {
  return (
    <div
      className="bg-[#484f58] bg-size-[100%_100%,auto] bg-top-left rounded shrink-0 size-12"
      data-name="Track Cover"
      style={{ backgroundImage: `url('${imgTrackCover}')` }}
    />
  );
}

function Container24() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[110.77px]">
        <p className="block leading-[normal]">Midnight Groove</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[74.66px]">
        <p className="block leading-[normal]">Electro Vibes</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[198.69px]"
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
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[57.31px]">
        <p className="block leading-[normal]">1.2K Plays</p>
      </div>
    </div>
  );
}

function Background8() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-3 py-2 relative w-full">
          <TrackCover />
          <Container26 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function TrackCover1() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[154.73%_100%,auto] rounded shrink-0 size-12"
      data-name="Track Cover"
      style={{ backgroundImage: `url('${imgTrackCover1}')` }}
    />
  );
}

function Container28() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[110.14px]">
        <p className="block leading-[normal]">Sunrise Serenity</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[96.5px]">
        <p className="block leading-[normal]">Acoustic Dreams</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[199.97px]"
      data-name="Container"
    >
      <Container28 />
      <Container29 />
    </div>
  );
}

function Container31() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[56.03px]">
        <p className="block leading-[normal]">980 Plays</p>
      </div>
    </div>
  );
}

function Background9() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-3 py-2 relative w-full">
          <TrackCover1 />
          <Container30 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-3 items-start justify-start left-6 p-0 right-6 top-[819px]"
      data-name="Container"
    >
      <Background8 />
      <Background9 />
    </div>
  );
}

function Heading6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[187.73px]">
        <p className="block leading-[normal]">Blockchain Transactions</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[53.77px]">
        <p className="block leading-[normal]">View All</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-between left-6 p-0 right-6 top-[1009px]"
      data-name="Container"
    >
      <Heading6 />
      <Button7 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p24131600}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p19625200}
            id="Vector_2"
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

function Svg6() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group2 />
    </div>
  );
}

function Background10() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[18px] shrink-0 size-9"
      data-name="Background"
    >
      <Svg6 />
    </div>
  );
}

function Container34() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[188.38px]">
        <p className="block leading-[normal]">Gifted 50 Stars to @friend_x</p>
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[67.61px]">
        <p className="block leading-[normal]">2 hours ago</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[196.73px]"
      data-name="Container"
    >
      <Container34 />
      <Container35 />
    </div>
  );
}

function Container37() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[63.27px]">
        <p className="block leading-[normal]">-50 Stars</p>
      </div>
    </div>
  );
}

function Background11() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-4 py-3 relative w-full">
          <Background10 />
          <Container36 />
          <Container37 />
        </div>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p36930d00}
            id="Vector"
            stroke="var(--stroke-0, #D29922)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p12512780}
            id="Vector_2"
            stroke="var(--stroke-0, #D29922)"
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
      <Group3 />
    </div>
  );
}

function Background12() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[18px] shrink-0 size-9"
      data-name="Background"
    >
      <Svg7 />
    </div>
  );
}

function Container38() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[normal] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[133.41px]">
        <p className="block mb-0">{`NFT Trade: "Groove`}</p>
        <p className="block">{`Guardian"`}</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[56.34px]">
        <p className="block leading-[normal]">Yesterday</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[195.09px]"
      data-name="Container"
    >
      <Container38 />
      <Container39 />
    </div>
  );
}

function Container41() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[64.91px]">
        <p className="block leading-[normal]">+0.5 TON</p>
      </div>
    </div>
  );
}

function Background13() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-4 py-3 relative w-full">
          <Background12 />
          <Container40 />
          <Container41 />
        </div>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col gap-3 items-start justify-start left-6 p-0 right-6 top-[1049px]"
      data-name="Container"
    >
      <Background11 />
      <Background13 />
    </div>
  );
}

function Svg8() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p1c75eb80}
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
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg8 />
    </div>
  );
}

function Button8() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon4 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[72.16px]">
        <p className="block leading-[normal]">Add Wallet</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-between left-[283px] p-0 right-[21px] top-[1247px]"
      data-name="Container"
    >
      <Button8 />
    </div>
  );
}

function Heading7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[135.13px]">
        <p className="block leading-[normal]">Wallet Integration</p>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p217d8b80}
            id="Vector"
            stroke="var(--stroke-0, #C9D1D9)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p18d88200}
            id="Vector_2"
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

function Svg9() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group4 />
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

function Container44() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[69.64px]">
        <p className="block leading-[normal]">1.25 TON</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <IconifyIcon5 />
      <Container44 />
    </div>
  );
}

function Svg10() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path
            d={svgPaths.p2875c4c0}
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

function Container46() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[81.78px]">
        <p className="block leading-[normal]">0.003 ETH</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <IconifyIcon6 />
      <Container46 />
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#ff4400] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-center justify-center px-4 py-2.5 relative w-full">
          <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[106.44px]">
            <p className="block leading-[normal]">Manage Wallets</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Background14() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-3 items-start justify-start left-6 p-[16px] right-6 rounded-lg top-[1278px]"
      data-name="Background"
    >
      <Heading7 />
      <Container45 />
      <Container47 />
      <Button9 />
    </div>
  );
}

function Margin() {
  return (
    <div
      className="absolute bottom-[1357px] h-[84px] translate-x-[-50%] w-[376px]"
      data-name="Margin"
      style={{ left: "calc(50% - 12px)" }}
    />
  );
}

function Heading8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[144.91px]">
        <p className="block leading-[normal]">Your Stars Balance</p>
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-row items-center justify-start left-6 p-0 right-6 top-[1663px]"
      data-name="Container"
    >
      <Heading8 />
    </div>
  );
}

function Svg11() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path
            d={svgPaths.pab34a00}
            id="Vector"
            stroke="var(--stroke-0, #D29922)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

function Container49() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[81.11px]">
        <p className="block leading-[normal]">1250 Stars</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Svg11 />
      <Container49 />
    </div>
  );
}

function Svg12() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path
            d={svgPaths.p24d4b800}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
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
      <Svg12 />
    </div>
  );
}

function Button10() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-row gap-1.5 items-center justify-start px-4 py-2.5 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon7 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[127.31px]">
        <p className="block leading-[normal]">Convert to Toncoin</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute left-0 size-[18px] top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Group">
          <path
            d={svgPaths.p16f22480}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p1fe84000}
            id="Vector_2"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg13() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <Group5 />
    </div>
  );
}

function IconifyIcon8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg13 />
    </div>
  );
}

function Button11() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-row gap-1.5 items-center justify-start px-4 py-2.5 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon8 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[62.09px]">
        <p className="block leading-[normal]">Gift Stars</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button10 />
      <Button11 />
    </div>
  );
}

function Background15() {
  return (
    <div
      className="absolute bg-[#161b22] box-border content-stretch flex flex-col gap-4 items-start justify-start left-6 p-[16px] right-6 rounded-lg top-[1707px]"
      data-name="Background"
    >
      <Container50 />
      <Container51 />
    </div>
  );
}

function Background16() {
  return (
    <div
      className="bg-[#161b22] h-[2013px] overflow-clip relative rounded-2xl shrink-0 w-[400px]"
      data-name="Background"
    >
      <Container2 />
      <Background />
      <Container6 />
      <Container10 />
      <Container11 />
      <Container15 />
      <Container16 />
      <Background7 />
      <Container23 />
      <Container32 />
      <Container33 />
      <Container42 />
      <Container43 />
      <Background14 />
      <Margin />
      <Container48 />
      <Background15 />
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <div className="bg-[#0d1117] relative size-full" data-name="User profile page">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-start justify-center p-[20px] relative size-full">
          <Background16 />
        </div>
      </div>
    </div>
  );
}