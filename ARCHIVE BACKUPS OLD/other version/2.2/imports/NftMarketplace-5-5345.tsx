import svgPaths from "./svg-g8zvlxcsj3";
import imgFeaturedNft from "figma:asset/063bcbc0dfe8da3f7c3395961e76884ea1607364.png";
import imgNftThumbnail from "figma:asset/9bad0196c7c040d346e64e8cfeed505171c08e59.png";
import imgNftThumbnail1 from "figma:asset/519b76b7e7012f7180a23406792b87a4c99a42d9.png";
import imgNftThumbnail2 from "figma:asset/ba59d117cf439a0f337c59b93c7ca4f92a996ce3.png";

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[21px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[147.3px]">
        <p className="block leading-[normal]">NFT Marketplace</p>
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
            d="M17.5 17.5L13.8833 13.8833"
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p2f913d00}
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

function Svg() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group />
    </div>
  );
}

function IconifyIcon() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative self-stretch shrink-0"
      data-name="iconify-icon"
    >
      <Svg />
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="SVG">
          <path
            d={svgPaths.p12f1c600}
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
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative self-stretch shrink-0"
      data-name="iconify-icon"
    >
      <Svg1 />
    </div>
  );
}

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon />
      <IconifyIcon1 />
    </div>
  );
}

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container />
      <Container1 />
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p36bdefc0}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
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
      <Svg2 />
    </div>
  );
}

function Button() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2.5 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon2 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center w-[90.59px]">
        <p className="block leading-[normal]">Sell Your NFT</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-start justify-end p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button />
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[162.52px]">
        <p className="block leading-[normal]">Featured Collectibles</p>
      </div>
    </div>
  );
}

function FeaturedNft() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_132.5%] h-[180px] rounded-lg shrink-0 w-full"
      data-name="Featured NFT"
      style={{ backgroundImage: `url('${imgFeaturedNft}')` }}
    />
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[185.86px]">
        <p className="block leading-[normal]">Rare Remix Masterpiece</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-left w-[104.16px]">
        <p className="block leading-[normal]">by DJ BeatDrop</p>
      </div>
    </div>
  );
}

function Svg3() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p24a12c00}
            id="Vector"
            stroke="var(--stroke-0, #D29922)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
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
      <Svg3 />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <IconifyIcon3 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[71.91px]">
        <p className="block leading-[normal]">1500 Stars</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container4 />
      <Container5 />
      <Container6 />
    </div>
  );
}

function Button1() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-4 py-2.5 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center w-[59.83px]">
        <p className="block leading-[normal]">Buy Now</p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#0d1117] relative rounded-lg shrink-0 w-full" data-name="Background+Border">
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-lg"
      />
      <div className="flex flex-col items-end relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 items-end justify-start p-[17px] relative w-full">
          <FeaturedNft />
          <Container7 />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading3 />
      <BackgroundBorder />
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[145.36px]">
        <p className="block leading-[normal]">Browse Categories</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div
      className="absolute bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center left-0 px-3.5 py-2 rounded-[7px] top-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center w-[16.98px]">
        <p className="block leading-[normal]">All</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div
      className="absolute bg-[#484f58] box-border content-stretch flex flex-col items-center justify-center left-[52.98px] px-3.5 py-2 rounded-[7px] top-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-center w-[40.36px]">
        <p className="block leading-[normal]">Music</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div
      className="absolute bg-[#484f58] box-border content-stretch flex flex-col items-center justify-center left-[129.34px] px-3.5 py-2 rounded-[7px] top-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-center w-[20.34px]">
        <p className="block leading-[normal]">Art</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div
      className="absolute bg-[#484f58] box-border content-stretch flex flex-col items-center justify-center left-[185.69px] px-3.5 py-2 rounded-[7px] top-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-center w-[78.33px]">
        <p className="block leading-[normal]">Collectibles</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div
      className="absolute bg-[#484f58] box-border content-stretch flex flex-col items-center justify-center left-[300.02px] px-3.5 py-2 rounded-[7px] top-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-center w-[41.88px]">
        <p className="block leading-[normal]">Rights</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="h-[37px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
    </div>
  );
}

function Container10() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading4 />
      <Container9 />
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[111.41px]">
        <p className="block leading-[normal]">Latest Listings</p>
      </div>
    </div>
  );
}

function NftThumbnail() {
  return (
    <div
      className="bg-no-repeat bg-size-[150%_100%] bg-top rounded-lg shrink-0 size-14"
      data-name="NFT Thumbnail"
      style={{ backgroundImage: `url('${imgNftThumbnail}')` }}
    />
  );
}

function Container11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[normal] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[75.23px]">
        <p className="block mb-0">Synthwave</p>
        <p className="block">Anthem</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[77.89px]">
        <p className="block leading-[normal]">by RetroWave</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[110.14px]"
      data-name="Container"
    >
      <Container11 />
      <Container12 />
    </div>
  );
}

function Svg4() {
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

function IconifyIcon4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg4 />
    </div>
  );
}

function Container14() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start pl-0 pr-[16.43px] py-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon4 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[34px] justify-center leading-[normal] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[35.41px]">
        <p className="block mb-0">350</p>
        <p className="block">Stars</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-3 py-1.5 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-center w-[22.02px]">
        <p className="block leading-[normal]">Buy</p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#0d1117] relative shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-[17px] py-[13px] relative w-full">
          <NftThumbnail />
          <Container13 />
          <Container14 />
          <Button7 />
        </div>
      </div>
    </div>
  );
}

function NftThumbnail1() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_109.82%] h-14 rounded-lg shrink-0 w-[49.2px]"
      data-name="NFT Thumbnail"
      style={{ backgroundImage: `url('${imgNftThumbnail1}')` }}
    />
  );
}

function Container15() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[normal] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[91.86px]">
        <p className="block mb-0">Vocal Sample</p>
        <p className="block">Pack</p>
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
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[76.84px]">
        <p className="block leading-[normal]">by VoiceCraft</p>
      </div>
    </div>
  );
}

function Container17() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[112.88px]"
      data-name="Container"
    >
      <Container15 />
      <Container16 />
    </div>
  );
}

function Svg5() {
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

function IconifyIcon5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg5 />
    </div>
  );
}

function Container18() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start pl-0 pr-[20.51px] py-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon5 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[34px] justify-center leading-[normal] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[35.4px]">
        <p className="block mb-0">200</p>
        <p className="block">Stars</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-3 py-1.5 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-center w-[22.02px]">
        <p className="block leading-[normal]">Buy</p>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#0d1117] relative shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-[17px] py-[13px] relative w-full">
          <NftThumbnail1 />
          <Container17 />
          <Container18 />
          <Button8 />
        </div>
      </div>
    </div>
  );
}

function NftThumbnail2() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_114.07%] h-14 rounded-lg shrink-0 w-[47.91px]"
      data-name="NFT Thumbnail"
      style={{ backgroundImage: `url('${imgNftThumbnail2}')` }}
    />
  );
}

function Container19() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[normal] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[111.42px]">
        <p className="block mb-0">Exclusive Album</p>
        <p className="block">Art</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[59.78px]">
        <p className="block leading-[normal]">by ArtBeat</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[116.23px]"
      data-name="Container"
    >
      <Container19 />
      <Container20 />
    </div>
  );
}

function Svg6() {
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

function IconifyIcon6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg6 />
    </div>
  );
}

function Container22() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start pl-0 pr-[18.43px] py-0 relative shrink-0"
      data-name="Container"
    >
      <IconifyIcon6 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[34px] justify-center leading-[normal] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[35.41px]">
        <p className="block mb-0">500</p>
        <p className="block">Stars</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-3 py-1.5 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-center w-[22.02px]">
        <p className="block leading-[normal]">Buy</p>
      </div>
    </div>
  );
}

function BackgroundBorder3() {
  return (
    <div className="bg-[#0d1117] relative shrink-0 w-full" data-name="Background+Border">
      <div aria-hidden="true" className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-[17px] py-[13px] relative w-full">
          <NftThumbnail2 />
          <Container21 />
          <Container22 />
          <Button9 />
        </div>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <BackgroundBorder1 />
      <BackgroundBorder2 />
      <BackgroundBorder3 />
    </div>
  );
}

function Container24() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading5 />
      <Container23 />
    </div>
  );
}

function Background() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-6 items-start justify-start mr-[-24px] p-[24px] relative rounded-2xl shrink-0 w-[400px]"
      data-name="Background"
    >
      <Container2 />
      <div className="bg-[#30363d] h-px shrink-0 w-full" data-name="Horizontal Divider" />
      <Container3 />
      <Container8 />
      <Container10 />
      <Container24 />
    </div>
  );
}

export default function NftMarketplace() {
  return (
    <div className="bg-[#0d1117] relative size-full" data-name="NFT Marketplace">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-start justify-center pl-5 pr-11 py-5 relative size-full">
          <Background />
        </div>
      </div>
    </div>
  );
}