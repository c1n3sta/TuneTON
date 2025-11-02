import svgPaths from "./svg-mm0ssevrl2";
import imgFeaturedAlbumCover from "figma:asset/20cb698982d776e1e84c052c455bbfbfbca1f7eb.png";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgMedia from "figma:asset/0f0bd1aa7cb80152118d7455a9240d0f8042b8d1.png";
import imgNft from "figma:asset/3260b153a4ff903e2d7b24a6d27e51b15a4ef6b0.png";
import imgUserAvatar from "figma:asset/84d6545ac22a8fa7cc695789dc8e2ff29992a5af.png";
import imgUserAvatar1 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";

function FeaturedAlbumCover() {
  return (
    <div
      className="absolute bg-left bg-no-repeat bg-size-[100%_133.33%] inset-0"
      data-name="Featured Album Cover"
      style={{ backgroundImage: `url('${imgFeaturedAlbumCover}')` }}
    />
  );
}

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-9 justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[18px] text-left w-[153px]">
        <p className="block leading-[normal]">The New Era</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-8 items-start justify-start overflow-clip p-0 relative shrink-0 w-[174px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[33px] justify-center leading-[0] relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-left w-40">
        <p className="block leading-[normal]">Future Sounds</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container />
      <Container1 />
    </div>
  );
}

function Svg() {
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

function Button() {
  return (
    <div
      className="absolute bg-[#ff22fb] bottom-4 box-border content-stretch flex flex-row items-center justify-center px-1.5 py-px right-4 rounded-3xl size-12"
      data-name="Button"
    >
      <Svg />
    </div>
  );
}

function Background() {
  return (
    <div
      className="absolute bg-gradient-to-t bottom-[-0.06px] box-border content-stretch flex flex-col from-[#000000cc] h-[106px] items-start justify-start left-0 p-[16px] right-0 to-[#00000000]"
      data-name="Background"
    >
      <Container2 />
      <Button />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#161b22] h-[300px] overflow-clip relative rounded-2xl shrink-0 w-full" data-name="Background">
      <FeaturedAlbumCover />
      <Background />
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[242px]">
        <p className="block leading-[normal]">{`Artist Bio & Story`}</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[21px] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[342.06px]">
        <p className="block mb-0">SynthWave Sam is a visionary electronic music</p>
        <p className="block mb-0">producer known for his nostalgic yet futuristic</p>
        <p className="block mb-0">soundscapes. Blending 80s synth-pop with modern</p>
        <p className="block mb-0">electronic beats, Sam creates immersive sonic</p>
        <p className="block mb-0">journeys that transport listeners to a vibrant, retro-</p>
        <p className="block mb-0">futuristic world. His tracks are characterized by</p>
        <p className="block mb-0">pulsating basslines, shimmering synthesizers, and</p>
        <p className="block">evocative melodies.</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-left w-[217.86px]">
        <p className="block leading-[normal]">Favorite Synth: Roland Juno-106</p>
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
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-left w-[185.83px]">
        <p className="block leading-[normal]">First Instrument: Casio SK-1</p>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[12px] relative w-full">
          <Container4 />
          <Container5 />
        </div>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pt-[14.94px] px-6 relative w-full">
          <Background1 />
          <Heading2 />
          <Container3 />
          <Background2 />
        </div>
      </div>
    </div>
  );
}

function Margin() {
  return (
    <div
      className="absolute bottom-[2238.06px] box-border content-stretch flex flex-col items-start justify-start left-1/2 pb-6 pt-0 px-0 translate-x-[-50%] w-[400px]"
      data-name="Margin"
    >
      <Container6 />
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[37px] items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[19px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[269px]">
        <p className="block leading-[normal]">Music Showcase</p>
      </div>
    </div>
  );
}

function AlbumArt() {
  return (
    <div
      className="bg-[#484f58] bg-size-[100%_100%,auto] bg-top-left rounded-lg shrink-0 size-[60px]"
      data-name="Album Art"
      style={{ backgroundImage: `url('${imgAlbumArt}')` }}
    />
  );
}

function Container7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[93.09px]">
        <p className="block leading-[normal]">Electric City</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[normal] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[138.56px]">
        <p className="block mb-0">1.5M Plays • 25K Likes •</p>
        <p className="block">1.2K Remixes</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[162.97px]"
      data-name="Container"
    >
      <Container7 />
      <Container8 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p3479c980}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p3d9bdc00}
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

function Svg1() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
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

function Button1() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-row gap-1 items-center justify-start px-3 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <IconifyIcon />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#dffcf8] text-[12px] text-center w-[35.03px]">
        <p className="block leading-[normal]">Remix</p>
      </div>
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background+Border">
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-lg"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-[13px] relative w-full">
          <AlbumArt />
          <Container9 />
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function AlbumArt1() {
  return (
    <div
      className="bg-[#484f58] bg-size-[100%_100%,auto] bg-top-left rounded-lg shrink-0 size-[60px]"
      data-name="Album Art"
      style={{ backgroundImage: `url('${imgAlbumArt}')` }}
    />
  );
}

function Container10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[112.33px]">
        <p className="block leading-[normal]">Midnight Drive</p>
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
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[normal] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[139.38px]">
        <p className="block mb-0">1.2M Plays • 20K Likes •</p>
        <p className="block">900 Remixes</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[162.97px]"
      data-name="Container"
    >
      <Container10 />
      <Container11 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p3479c980}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p3d9bdc00}
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

function Svg2() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
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
      <Svg2 />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-row gap-1 items-center justify-start px-3 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <IconifyIcon1 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#dffcf8] text-[12px] text-center w-[35.03px]">
        <p className="block leading-[normal]">Remix</p>
      </div>
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background+Border">
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-lg"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-[13px] relative w-full">
          <AlbumArt1 />
          <Container12 />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function AlbumArt2() {
  return (
    <div
      className="bg-[#484f58] bg-size-[100%_100%,auto] bg-top-left rounded-lg shrink-0 size-[60px]"
      data-name="Album Art"
      style={{ backgroundImage: `url('${imgAlbumArt}')` }}
    />
  );
}

function Container13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[142.61px]">
        <p className="block leading-[normal]">Starlight Serenade</p>
      </div>
    </div>
  );
}

function Container14() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[normal] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[140.8px]">
        <p className="block mb-0">980K Plays • 18K Likes •</p>
        <p className="block">750 Remixes</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[162.97px]"
      data-name="Container"
    >
      <Container13 />
      <Container14 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p3479c980}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p3d9bdc00}
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

function Svg3() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Group2 />
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

function Button3() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-row gap-1 items-center justify-start px-3 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <IconifyIcon2 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#dffcf8] text-[12px] text-center w-[35.03px]">
        <p className="block leading-[normal]">Remix</p>
      </div>
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background+Border">
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-lg"
      />
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-[13px] relative w-full">
          <AlbumArt2 />
          <Container15 />
          <Button3 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <BackgroundBorder />
      <BackgroundBorder1 />
      <BackgroundBorder2 />
    </div>
  );
}

function Container17() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pt-[14.94px] px-6 relative w-full">
          <Heading4 />
          <Container16 />
        </div>
      </div>
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-6 pt-0 px-0 right-0 top-[752px]"
      data-name="Margin"
    >
      <Container17 />
    </div>
  );
}

function Margin2() {
  return <div className="absolute h-6 left-0 right-0 top-[739.88px]" data-name="Margin" />;
}

function Heading5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[226px]">
        <p className="block leading-[normal]">Discography</p>
      </div>
    </div>
  );
}

function AlbumCover() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_109.33%] h-[100px] rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-[109.33px]"
      data-name="Album Cover"
      style={{ backgroundImage: `url('${imgAlbumArt}')` }}
    />
  );
}

function ImgAlbumCoverMargin() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[108px] items-start justify-start pb-2 pt-0 px-0 relative shrink-0"
      data-name="Img - Album Cover:margin"
    >
      <AlbumCover />
    </div>
  );
}

function Container18() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start px-[29.81px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[34px] justify-center leading-[normal] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[49.71px]">
        <p className="block mb-0">Future</p>
        <p className="block">Echoes</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start px-[26.88px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[30px] justify-center leading-[normal] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[55.57px]">
        <p className="block mb-0">2023 • 10</p>
        <p className="block">Tracks</p>
      </div>
    </div>
  );
}

function Background3() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-center justify-start overflow-clip pb-2 pt-0 px-0 relative rounded-lg self-stretch shrink-0 w-[109.33px]"
      data-name="Background"
    >
      <ImgAlbumCoverMargin />
      <Container18 />
      <Container19 />
    </div>
  );
}

function AlbumCover1() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_109.33%] h-[100px] rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-[109.33px]"
      data-name="Album Cover"
      style={{ backgroundImage: `url('${imgAlbumArt}')` }}
    />
  );
}

function ImgAlbumCoverMargin1() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[108px] items-start justify-start pb-2 pt-0 px-0 relative shrink-0"
      data-name="Img - Album Cover:margin"
    >
      <AlbumCover1 />
    </div>
  );
}

function Container20() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start pl-[21.17px] pr-[21.18px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[34px] justify-center leading-[normal] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[66.98px]">
        <p className="block mb-0">Neon City</p>
        <p className="block">Nights</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start px-2 py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[91.92px]">
        <p className="block leading-[normal]">2022 • 8 Tracks</p>
      </div>
    </div>
  );
}

function Background4() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-center justify-start overflow-clip pb-2 pt-0 px-0 relative rounded-lg self-stretch shrink-0 w-[109.33px]"
      data-name="Background"
    >
      <ImgAlbumCoverMargin1 />
      <Container20 />
      <Container21 />
    </div>
  );
}

function AlbumCover2() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_109.34%] h-[100px] rounded-tl-[8px] rounded-tr-[8px] shrink-0 w-[109.34px]"
      data-name="Album Cover"
      style={{ backgroundImage: `url('${imgAlbumArt}')` }}
    />
  );
}

function ImgAlbumCoverMargin2() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[108px] items-start justify-start pb-2 pt-0 px-0 relative shrink-0"
      data-name="Img - Album Cover:margin"
    >
      <AlbumCover2 />
    </div>
  );
}

function Container22() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start px-2 py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[75.2px]">
        <p className="block leading-[normal]">Retrograde</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start pl-[28.26px] pr-[28.28px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[30px] justify-center leading-[normal] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[52.8px]">
        <p className="block mb-0">2021 • 12</p>
        <p className="block">Tracks</p>
      </div>
    </div>
  );
}

function Background5() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-center justify-start overflow-clip pb-2 pt-0 px-0 relative rounded-lg self-stretch shrink-0 w-[109.34px]"
      data-name="Background"
    >
      <ImgAlbumCoverMargin2 />
      <Container22 />
      <Container23 />
    </div>
  );
}

function Container24() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background3 />
      <Background4 />
      <Background5 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-[0.01px] pt-[14.93px] px-6 relative w-full">
          <Heading5 />
          <Container24 />
        </div>
      </div>
    </div>
  );
}

function Margin3() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-6 pt-0 px-0 right-0 top-[1151.06px]"
      data-name="Margin"
    >
      <Container25 />
    </div>
  );
}

function Margin4() {
  return <div className="absolute h-6 left-0 right-0 top-[1019.81px]" data-name="Margin" />;
}

function Heading6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[204.52px]">
        <p className="block leading-[normal]">{`Ratings & Leaderboards`}</p>
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
            d={svgPaths.p5df8380}
            id="Vector"
            stroke="var(--stroke-0, #D29922)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p26d14f00}
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

function Svg4() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group3 />
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

function Container26() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon3 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[82.05px]">
        <p className="block leading-[normal]">Top Performer</p>
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
            d={svgPaths.p7d7f780}
            id="Vector"
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

function Container27() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon4 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[50.08px]">
        <p className="block leading-[normal]">4.7 Stars</p>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.pf0d4b00}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p10e17d00}
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
      <Svg6 />
    </div>
  );
}

function Container28() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon5 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[76.56px]">
        <p className="block leading-[normal]">3.5K Remixes</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[53.1px] items-start justify-start pl-[18.55px] pr-[18.58px] py-0 relative w-full">
          <Container26 />
          <Container27 />
          <Container28 />
        </div>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start px-[10.53px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[30px] justify-center leading-[normal] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[56.27px]">
        <p className="block mb-0">Electronic</p>
        <p className="block">Ranking</p>
      </div>
    </div>
  );
}

function Background6() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start p-[16px] relative rounded-lg self-stretch shrink-0 w-[109.33px]"
      data-name="Background"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-6 justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[20px] text-center w-[25.22px]">
        <p className="block leading-[normal]">#2</p>
      </div>
      <Container30 />
    </div>
  );
}

function Container31() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start pl-[14.36px] pr-[14.38px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[30px] justify-center leading-[normal] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[48.59px]">
        <p className="block mb-0">Most</p>
        <p className="block">Remixed</p>
      </div>
    </div>
  );
}

function Background7() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-1 items-center justify-start p-[16px] relative rounded-lg self-stretch shrink-0 w-[109.33px]"
      data-name="Background"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-6 justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[20px] text-center w-[25.13px]">
        <p className="block leading-[normal]">#5</p>
      </div>
      <Container31 />
    </div>
  );
}

function ParagraphBackground() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold gap-1 items-center justify-start leading-[0] p-[16px] relative rounded-lg self-stretch shrink-0 text-center w-[109.34px]"
      data-name="Paragraph+Background"
    >
      <div className="flex flex-col h-6 justify-center relative shrink-0 text-[#ff22fb] text-[20px] w-[20.73px]">
        <p className="block leading-[normal]">12</p>
      </div>
      <div className="flex flex-col h-[15px] justify-center relative shrink-0 text-[#8b949e] text-[12px] w-[81.77px]">
        <p className="block leading-[normal]">Collaborations</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-center pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background6 />
      <Background7 />
      <ParagraphBackground />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pt-[14.94px] px-6 relative w-full">
          <Heading6 />
          <Container29 />
          <Container32 />
        </div>
      </div>
    </div>
  );
}

function Margin5() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-6 pt-0 px-0 right-0 top-[1421.87px]"
      data-name="Margin"
    >
      <Container33 />
    </div>
  );
}

function Margin6() {
  return <div className="absolute h-6 left-0 right-0 top-[1268.75px]" data-name="Margin" />;
}

function Heading7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[118.19px]">
        <p className="block leading-[normal]">Media Gallery</p>
      </div>
    </div>
  );
}

function Media() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_150%] h-[150px] shrink-0 w-full"
      data-name="Media"
      style={{ backgroundImage: `url('${imgMedia}')` }}
    />
  );
}

function Group5() {
  return (
    <div className="absolute left-0 size-8 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Group">
          <path
            d={svgPaths.p261d13c0}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.66667"
          />
          <path
            d={svgPaths.p9fc6800}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-8" data-name="SVG">
      <Group5 />
    </div>
  );
}

function Overlay() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.4)] box-border content-stretch flex flex-row inset-0 items-center justify-center p-0"
      data-name="Overlay"
    >
      <Svg7 />
    </div>
  );
}

function Background8() {
  return (
    <div
      className="absolute bg-[#484f58] box-border content-stretch flex flex-col items-start justify-center left-0 overflow-clip p-0 rounded-lg size-[150px] top-0"
      data-name="Background"
    >
      <Media />
      <Overlay />
    </div>
  );
}

function Media1() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_150%] h-[150px] shrink-0 w-full"
      data-name="Media"
      style={{ backgroundImage: `url('${imgMedia}')` }}
    />
  );
}

function Group6() {
  return (
    <div className="absolute left-0 size-8 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Group">
          <path
            d={svgPaths.p3b451700}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.66667"
          />
          <path
            d={svgPaths.p26781900}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.66667"
          />
          <path
            d={svgPaths.pca0b150}
            id="Vector_3"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg8() {
  return (
    <div className="relative shrink-0 size-8" data-name="SVG">
      <Group6 />
    </div>
  );
}

function Overlay1() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.4)] box-border content-stretch flex flex-row inset-0 items-center justify-center p-0"
      data-name="Overlay"
    >
      <Svg8 />
    </div>
  );
}

function Background9() {
  return (
    <div
      className="absolute bg-[#484f58] box-border content-stretch flex flex-col items-start justify-center left-[162px] overflow-clip p-0 rounded-lg size-[150px] top-0"
      data-name="Background"
    >
      <Media1 />
      <Overlay1 />
    </div>
  );
}

function Media2() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_150%] h-[150px] shrink-0 w-full"
      data-name="Media"
      style={{ backgroundImage: `url('${imgMedia}')` }}
    />
  );
}

function Group7() {
  return (
    <div className="absolute left-0 size-8 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Group">
          <path
            d={svgPaths.p369f0b00}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.66667"
          />
          <path
            d={svgPaths.p38595c0}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.66667"
          />
        </g>
      </svg>
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-8" data-name="SVG">
      <Group7 />
    </div>
  );
}

function Overlay2() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0.4)] box-border content-stretch flex flex-row inset-0 items-center justify-center p-0"
      data-name="Overlay"
    >
      <Svg9 />
    </div>
  );
}

function Background10() {
  return (
    <div
      className="absolute bg-[#484f58] box-border content-stretch flex flex-col items-start justify-center left-[324px] overflow-clip p-0 rounded-lg size-[150px] top-0"
      data-name="Background"
    >
      <Media2 />
      <Overlay2 />
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[158px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Background8 />
      <Background9 />
      <Background10 />
    </div>
  );
}

function Container35() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pt-[14.94px] px-6 relative w-full">
          <Heading7 />
          <Container34 />
        </div>
      </div>
    </div>
  );
}

function Margin7() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-6 pt-0 px-0 right-0 top-[1670.81px]"
      data-name="Margin"
    >
      <Container35 />
    </div>
  );
}

function Margin8() {
  return <div className="absolute h-6 left-0 right-0 top-[1526.69px]" data-name="Margin" />;
}

function Heading8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[150.58px]">
        <p className="block leading-[normal]">Upcoming Events</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start pl-[0.63px] pr-[0.64px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[48.73px]">
        <p className="block leading-[normal]">AUG 15</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[185.77px]">
        <p className="block leading-[normal]">Synthwave Live @ The Grid</p>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[85.47px]">
        <p className="block leading-[normal]">Virtual Concert</p>
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[198.27px]"
      data-name="Container"
    >
      <Container37 />
      <Container38 />
    </div>
  );
}

function Button4() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-3 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-center w-[31.73px]">
        <p className="block leading-[normal]">RSVP</p>
      </div>
    </div>
  );
}

function Background11() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-[12px] relative w-full">
          <Container36 />
          <Container39 />
          <Button4 />
        </div>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start pl-[0.94px] pr-[0.95px] py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[48.11px]">
        <p className="block leading-[normal]">SEP 02</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[111.55px]">
        <p className="block leading-[normal]">RetroFuture Fest</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[93.3px]">
        <p className="block leading-[normal]">Los Angeles, CA</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-0.5 items-start justify-start p-0 relative shrink-0 w-[188.28px]"
      data-name="Container"
    >
      <Container41 />
      <Container42 />
    </div>
  );
}

function Button5() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-3 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[12px] text-center w-[41.72px]">
        <p className="block leading-[normal]">Tickets</p>
      </div>
    </div>
  );
}

function Background12() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-[12px] relative w-full">
          <Container40 />
          <Container43 />
          <Button5 />
        </div>
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background11 />
      <Background12 />
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pt-[14.94px] px-6 relative w-full">
          <Heading8 />
          <Container44 />
        </div>
      </div>
    </div>
  );
}

function Margin9() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-6 pt-0 px-0 right-0 top-[1808px]"
      data-name="Margin"
    >
      <Container45 />
    </div>
  );
}

function Margin10() {
  return <div className="absolute h-6 left-0 right-0 top-[1754.63px]" data-name="Margin" />;
}

function Heading9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[166.94px]">
        <p className="block leading-[normal]">{`Social & Blockchain`}</p>
      </div>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p5f8d880}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p131e4f40}
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

function Svg10() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group8 />
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
      className="bg-[#161b22] box-border content-stretch flex flex-row gap-1 items-center justify-start px-3 py-2 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon6 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-center w-[66.98px]">
        <p className="block leading-[normal]">Instagram</p>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute left-0 size-5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path
            d={svgPaths.p21ec88c0}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p30a3ea40}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p28159780}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.66667"
          />
          <path
            d={svgPaths.p350d0c60}
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

function Svg11() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group9 />
    </div>
  );
}

function IconifyIcon7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg11 />
    </div>
  );
}

function Button7() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-row gap-1 items-center justify-start px-3 py-2 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon7 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-center w-[62.44px]">
        <p className="block leading-[normal]">Telegram</p>
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

function Svg12() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group10 />
    </div>
  );
}

function IconifyIcon8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg12 />
    </div>
  );
}

function Button8() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-row gap-1 items-center justify-start px-3 py-2 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon8 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[14px] text-center w-[54.14px]">
        <p className="block leading-[normal]">Website</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button6 />
      <Button7 />
      <Button8 />
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 3"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[85.75px]">
        <p className="block leading-[normal]">Artist NFTs</p>
      </div>
    </div>
  );
}

function Nft() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_170%] h-[100px] shrink-0 w-[170px]"
      data-name="NFT"
      style={{ backgroundImage: `url('${imgNft}')` }}
    />
  );
}

function ImgNftMargin() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[108px] items-start justify-start pb-2 pt-0 px-0 relative shrink-0"
      data-name="Img - NFT:margin"
    >
      <Nft />
    </div>
  );
}

function Container47() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start px-2 py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[12px] text-center w-[142.89px]">
        <p className="block leading-[normal]">Cyberpunk Anthem #001</p>
      </div>
    </div>
  );
}

function Background13() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-center justify-start overflow-clip pb-2 pt-0 px-0 relative rounded-lg self-stretch shrink-0 w-[170px]"
      data-name="Background"
    >
      <ImgNftMargin />
      <Container47 />
    </div>
  );
}

function Nft1() {
  return (
    <div
      className="bg-left bg-no-repeat bg-size-[100%_170%] h-[100px] shrink-0 w-[170px]"
      data-name="NFT"
      style={{ backgroundImage: `url('${imgNft}')` }}
    />
  );
}

function ImgNftMargin1() {
  return (
    <div
      className="box-border content-stretch flex flex-col h-[108px] items-start justify-start pb-2 pt-0 px-0 relative shrink-0"
      data-name="Img - NFT:margin"
    >
      <Nft1 />
    </div>
  );
}

function Container48() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start px-2 py-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[12px] text-center w-[99.75px]">
        <p className="block leading-[normal]">Digital Sunset Art</p>
      </div>
    </div>
  );
}

function Background14() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-center justify-start overflow-clip pb-2 pt-0 px-0 relative rounded-lg self-stretch shrink-0 w-[170px]"
      data-name="Background"
    >
      <ImgNftMargin1 />
      <Container48 />
    </div>
  );
}

function Container49() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-center pb-1 pt-0 px-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background13 />
      <Background14 />
    </div>
  );
}

function Button9() {
  return (
    <div className="bg-[#ff4400] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-center justify-center px-4 py-2.5 relative w-full">
          <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#dffcf8] text-[14px] text-center w-[140.7px]">
            <p className="block leading-[normal]">View on Marketplace</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading3 />
      <Container49 />
      <Button9 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p1001afe0}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p2b311000}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.pd94e100}
            id="Vector_3"
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

function Svg13() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Group11 />
    </div>
  );
}

function IconifyIcon9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg13 />
    </div>
  );
}

function Button10() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-row gap-2 items-center justify-start px-4 py-2.5 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <IconifyIcon9 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center w-[87.16px]">
        <p className="block leading-[normal]">Tip with TON</p>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button10 />
    </div>
  );
}

function Container52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-[0.01px] pt-[14.93px] px-6 relative w-full">
          <Heading9 />
          <Container46 />
          <Container50 />
          <Container51 />
        </div>
      </div>
    </div>
  );
}

function Margin11() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-6 pt-0 px-0 right-0 top-[2099px]"
      data-name="Margin"
    >
      <Container52 />
    </div>
  );
}

function Margin12() {
  return <div className="absolute h-6 left-0 right-0 top-[2215.56px]" data-name="Margin" />;
}

function Heading10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[242.11px]">
        <p className="block leading-[normal]">{`Fan Interaction & Comments feed`}</p>
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#757575] text-[14px] text-left w-[129.41px]">
        <p className="block leading-[normal]">Leave a comment...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-start justify-start overflow-clip px-3 py-2.5 relative rounded-[7px] self-stretch shrink-0 w-[282.34px]"
      data-name="Input"
    >
      <Container53 />
    </div>
  );
}

function Button11() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-4 py-2.5 relative rounded-[7px] shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center w-[29.66px]">
        <p className="block leading-[normal]">Post</p>
      </div>
    </div>
  );
}

function Container54() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Input />
      <Button11 />
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

function Container55() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[96.89px]">
        <p className="block leading-[normal]">MusicLover99</p>
      </div>
    </div>
  );
}

function Container56() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[62.36px]">
        <p className="block leading-[normal]">2 days ago</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container55 />
      <Container56 />
    </div>
  );
}

function Container58() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[19.6px] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[293.84px]">
        <p className="block mb-0">Electric City is my new obsession! The vibes</p>
        <p className="block">are immaculate.</p>
      </div>
    </div>
  );
}

function Margin13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-3.5 pt-[13.295px] px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container58 />
    </div>
  );
}

function Svg14() {
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

function IconifyIcon10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg14 />
    </div>
  );
}

function Button12() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon10 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[12.2px]">
        <p className="block leading-[normal]">12</p>
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
            d={svgPaths.p34fd4720}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p1c4ff500}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p1281b180}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.pce97200}
            id="Vector_4"
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

function Svg15() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group12 />
    </div>
  );
}

function IconifyIcon11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg15 />
    </div>
  );
}

function Button13() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon11 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[32.86px]">
        <p className="block leading-[normal]">Share</p>
      </div>
    </div>
  );
}

function Container59() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button12 />
      <Button13 />
    </div>
  );
}

function Margin14() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container59 />
    </div>
  );
}

function Container60() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative self-stretch shrink-0 w-[300px]"
      data-name="Container"
    >
      <Container57 />
      <Margin13 />
      <Margin14 />
    </div>
  );
}

function Container61() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <UserAvatar />
      <Container60 />
    </div>
  );
}

function UserAvatar1() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[20px] shrink-0 size-10"
      data-name="User Avatar"
      style={{ backgroundImage: `url('${imgUserAvatar1}')` }}
    />
  );
}

function Container62() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[72.44px]">
        <p className="block leading-[normal]">RemixKing</p>
      </div>
    </div>
  );
}

function Container63() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[62.16px]">
        <p className="block leading-[normal]">5 days ago</p>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container62 />
      <Container63 />
    </div>
  );
}

function Container65() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[274.56px]">
        <p className="block leading-[19.6px]">Just remixed Midnight Drive, check it out!</p>
      </div>
    </div>
  );
}

function Margin15() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start px-0 py-3.5 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container65 />
    </div>
  );
}

function Svg16() {
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

function IconifyIcon12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg16 />
    </div>
  );
}

function Button14() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon12 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[7.44px]">
        <p className="block leading-[normal]">8</p>
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
            d={svgPaths.p34fd4720}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p1c4ff500}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p1281b180}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.pce97200}
            id="Vector_4"
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

function Svg17() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group13 />
    </div>
  );
}

function IconifyIcon13() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg17 />
    </div>
  );
}

function Button15() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon13 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[32.86px]">
        <p className="block leading-[normal]">Share</p>
      </div>
    </div>
  );
}

function Container66() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button14 />
      <Button15 />
    </div>
  );
}

function Margin16() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container66 />
    </div>
  );
}

function Container67() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative self-stretch shrink-0 w-[300px]"
      data-name="Container"
    >
      <Container64 />
      <Margin15 />
      <Margin16 />
    </div>
  );
}

function Container68() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <UserAvatar1 />
      <Container67 />
    </div>
  );
}

function Container69() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container61 />
      <Container68 />
    </div>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pt-[14.94px] px-6 relative w-full">
          <Heading10 />
          <Container54 />
          <Container69 />
        </div>
      </div>
    </div>
  );
}

function Margin17() {
  return (
    <div
      className="absolute box-border content-stretch flex flex-col items-start justify-start left-0 pb-6 pt-0 px-0 right-0 top-[2564px]"
      data-name="Margin"
    >
      <Container70 />
    </div>
  );
}

function Background15() {
  return (
    <div
      className="bg-[#161b22] h-[3002px] overflow-clip relative rounded-2xl shrink-0 w-[400px]"
      data-name="Background"
    >
      <Margin />
      <Margin1 />
      <Margin2 />
      <Margin3 />
      <Margin4 />
      <Margin5 />
      <Margin6 />
      <Margin7 />
      <Margin8 />
      <Margin9 />
      <Margin10 />
      <Margin11 />
      <Margin12 />
      <Margin17 />
    </div>
  );
}

export default function ArtistPage() {
  return (
    <div className="bg-[#0d1117] relative size-full" data-name="Artist page">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-start justify-center p-[20px] relative size-full">
          <Background15 />
        </div>
      </div>
    </div>
  );
}