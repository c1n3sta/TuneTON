import svgPaths from "./svg-karfaoua2a";
import imgAlbumArt from "figma:asset/b13483f5f235f1c26e9cbdbfb40edb8ca3b9c11c.png";
import imgPlaylistCover from "figma:asset/e4df5775c88dbb71f1c09a72f65ba80adc015b71.png";
import imgPlaylistCover1 from "figma:asset/059d630bf1b73c65663230f6fe3660d07bc060b8.png";
import imgPlaylistCover2 from "figma:asset/20bb8fe31b212ec3236e8224dd3efe441043be2f.png";
import imgPlaylistCover3 from "figma:asset/a1ad22f09bf6f15ef5bc637a1785d31b1ca3884a.png";
import imgPlaylistCover4 from "figma:asset/08ea158ebabf976cca7bb1f8ec91d0c456a2f915.png";
import imgTrackCover from "figma:asset/5c0570c22db9da4233071e8dc020249fbd9aeece.png";
import imgTrackCover1 from "figma:asset/ee4dceec67617340be718a9b700bd99946447425.png";
import imgFeaturedRemixCover from "figma:asset/92af5e42f7a6be5cc4a3570d7557d9b846376457.png";
import imgRemixCover from "figma:asset/b4d5d93e0e03aef0e9252522600b2fe91d9305c2.png";
import imgRemixerAvatar from "figma:asset/02641910bdc93d1d98cf6da313c9fe42f75a5679.png";
import imgRemixCover1 from "figma:asset/2445cdb838670e8ea661ef232b16e90503fdec0b.png";
import imgRemixerAvatar1 from "figma:asset/66f8b9f85ad861c00f8936ae6466a1d89cdac769.png";
import imgRemixCover2 from "figma:asset/f6899fe4451eb26d22ac13df75a794b76f152b36.png";
import imgRemixerAvatar2 from "figma:asset/942f88b3ac884230b9cb4196019616c8ea6fb6a0.png";

function Container() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-[175px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[21px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-full">
        <p className="block leading-[normal]">Recently Played</p>
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
      className="box-border content-stretch flex flex-col h-full items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg />
    </div>
  );
}

function Button() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <div className="flex flex-row items-center self-stretch">
        <IconifyIcon />
      </div>
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

function AlbumArt() {
  return (
    <div
      className="bg-[#484f58] bg-size-[100%_100%,auto] bg-top-left rounded-lg shrink-0 size-12"
      data-name="Album Art"
      style={{ backgroundImage: `url('${imgAlbumArt}')` }}
    />
  );
}

function Container3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-full">
        <p className="block leading-[normal]">Starlight Serenade</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-full">
        <p className="block leading-[normal]">MelodyMix Artist</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[164px]"
      data-name="Container"
    >
      <Container3 />
      <Container4 />
    </div>
  );
}

function Background() {
  return (
    <div
      className="bg-[#484f58] box-border content-stretch flex flex-row gap-[3.4px] h-[30px] items-end justify-start overflow-clip pl-[5.69px] pr-[5.75px] py-0 relative rounded shrink-0 w-10"
      data-name="Background"
    >
      <div className="bg-[#ff22fb] h-3 opacity-80 rounded-sm shrink-0 w-[3px]" data-name="Background" />
      <div className="bg-[#ff22fb] h-[21px] opacity-80 rounded-sm shrink-0 w-[3px]" data-name="Background" />
      <div className="bg-[#ff22fb] h-[16.5px] opacity-80 rounded-sm shrink-0 w-[3px]" data-name="Background" />
      <div className="bg-[#ff22fb] h-[25.5px] opacity-80 rounded-sm shrink-0 w-[3px]" data-name="Background" />
      <div className="bg-[#ff22fb] h-[18px] opacity-80 rounded-sm shrink-0 w-[3px]" data-name="Background" />
    </div>
  );
}

function Svg1() {
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
      <Svg1 />
    </div>
  );
}

function Container6() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Background />
      <Button1 />
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#093067] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-[15px] items-center justify-start pl-4 pr-5 py-3 relative w-full">
          <AlbumArt />
          <Container5 />
          <Container6 />
        </div>
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-[171px]"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-full">
        <p className="block leading-[normal]">My Library</p>
      </div>
    </div>
  );
}

function Svg2() {
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

function ButtonIconifyIcon() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="Button → iconify-icon"
    >
      <Svg2 />
    </div>
  );
}

function Container7() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading2 />
      <ButtonIconifyIcon />
    </div>
  );
}

function PlaylistCover() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[110.3%_100%,auto] h-[100px] rounded-lg shrink-0 w-[90.66px]"
      data-name="Playlist Cover"
      style={{ backgroundImage: `url('${imgPlaylistCover}')` }}
    />
  );
}

function Container8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[70.88px]">
        <p className="block leading-[normal]">Chill Vibes</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[50.34px]">
        <p className="block leading-[normal]">15 tracks</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container8 />
      <Container9 />
    </div>
  );
}

function Background2() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[106.66px]"
      data-name="Background"
    >
      <PlaylistCover />
      <Container10 />
    </div>
  );
}

function PlaylistCover1() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[165.21%_100%,auto] h-[100px] rounded-lg shrink-0 w-[90.67px]"
      data-name="Playlist Cover"
      style={{ backgroundImage: `url('${imgPlaylistCover1}')` }}
    />
  );
}

function Container11() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[84.42px]">
        <p className="block leading-[normal]">Workout Mix</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[52.97px]">
        <p className="block leading-[normal]">22 tracks</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container11 />
      <Container12 />
    </div>
  );
}

function Background3() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[106.67px]"
      data-name="Background"
    >
      <PlaylistCover1 />
      <Container13 />
    </div>
  );
}

function PlaylistCover2() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[155.92%_100%,auto] h-[100px] rounded-lg shrink-0 w-[90.66px]"
      data-name="Playlist Cover"
      style={{ backgroundImage: `url('${imgPlaylistCover2}')` }}
    />
  );
}

function Container14() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[81.67px]">
        <p className="block leading-[normal]">Focus Beats</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[50.8px]">
        <p className="block leading-[normal]">10 tracks</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container14 />
      <Container15 />
    </div>
  );
}

function Background4() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[106.66px]"
      data-name="Background"
    >
      <PlaylistCover2 />
      <Container16 />
    </div>
  );
}

function Container17() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-4 items-start justify-center p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background2 />
      <Background3 />
      <Background4 />
    </div>
  );
}

function Heading3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-[260px]"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-full">
        <p className="block leading-[normal]">Community Playlists</p>
      </div>
    </div>
  );
}

function Svg3() {
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

function Button2() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon1 />
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ff22fb] text-[14px] text-center w-[44.58px]">
        <p className="block leading-[normal]">Create</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-center justify-between p-0 relative w-full">
          <Heading3 />
          <Button2 />
        </div>
      </div>
    </div>
  );
}

function PlaylistCover3() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[165.45%_100%,auto] h-[100px] rounded-lg shrink-0 w-[90.66px]"
      data-name="Playlist Cover"
      style={{ backgroundImage: `url('${imgPlaylistCover3}')` }}
    />
  );
}

function Container19() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[82.09px]">
        <p className="block leading-[normal]">Collab Jams</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[45.77px]">
        <p className="block leading-[normal]">8 tracks</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container19 />
      <Container20 />
    </div>
  );
}

function Background5() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[106.66px]"
      data-name="Background"
    >
      <PlaylistCover3 />
      <Container21 />
    </div>
  );
}

function PlaylistCover4() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[110.29%_100%,auto] h-[100px] rounded-lg shrink-0 w-[90.67px]"
      data-name="Playlist Cover"
      style={{ backgroundImage: `url('${imgPlaylistCover}')` }}
    />
  );
}

function Container22() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[89.41px]">
        <p className="block leading-[normal]">Project Alpha</p>
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[50.53px]">
        <p className="block leading-[normal]">12 tracks</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container22 />
      <Container23 />
    </div>
  );
}

function Background6() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[106.67px]"
      data-name="Background"
    >
      <PlaylistCover4 />
      <Container24 />
    </div>
  );
}

function Container25() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-4 items-start justify-center pl-0 pr-[122.67px] py-0 relative w-full">
          <Background5 />
          <Background6 />
        </div>
      </div>
    </div>
  );
}

function Heading4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[168.34px]">
        <p className="block leading-[normal]">AI Generated Playlists</p>
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

function Container26() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading4 />
      <Button3 />
    </div>
  );
}

function PlaylistCover5() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[147.07%_100%,auto] h-[100px] rounded-lg shrink-0 w-[90.66px]"
      data-name="Playlist Cover"
      style={{ backgroundImage: `url('${imgPlaylistCover4}')` }}
    />
  );
}

function Container27() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center overflow-clip relative size-full">
        <div className="box-border content-stretch flex flex-col items-center justify-start pl-0 pr-[2.1px] py-0 relative w-full">
          <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[88.56px]">
            <p className="block leading-[normal]">Morning Fo…</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[74.33px]">
        <p className="block leading-[normal]">AI Generated</p>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container27 />
      <Container28 />
    </div>
  );
}

function Background7() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[106.66px]"
      data-name="Background"
    >
      <PlaylistCover5 />
      <Container29 />
    </div>
  );
}

function PlaylistCover6() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[165.21%_100%,auto] h-[100px] rounded-lg shrink-0 w-[90.67px]"
      data-name="Playlist Cover"
      style={{ backgroundImage: `url('${imgPlaylistCover1}')` }}
    />
  );
}

function Container30() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-center w-[86.5px]">
        <p className="block leading-[normal]">Evening Chill</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[15px] justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-center w-[74.33px]">
        <p className="block leading-[normal]">AI Generated</p>
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container30 />
      <Container31 />
    </div>
  );
}

function Background8() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-2 items-center justify-start p-[8px] relative rounded-lg self-stretch shrink-0 w-[106.67px]"
      data-name="Background"
    >
      <PlaylistCover6 />
      <Container32 />
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-4 items-start justify-center pl-0 pr-[122.67px] py-0 relative w-full">
          <Background7 />
          <Background8 />
        </div>
      </div>
    </div>
  );
}

function Heading5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[218px]">
        <p className="block leading-[normal]">Recommended Tracks</p>
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

function Container34() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading5 />
      <Button4 />
    </div>
  );
}

function TrackCover() {
  return (
    <div
      className="bg-[#484f58] bg-[position:0%_50%,_0%_0%] bg-size-[100%_150%,auto] rounded shrink-0 size-12"
      data-name="Track Cover"
      style={{ backgroundImage: `url('${imgTrackCover}')` }}
    />
  );
}

function Container35() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[85.31px]">
        <p className="block leading-[normal]">Sunset Drive</p>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[113.81px]">
        <p className="block leading-[normal]">Chillwave Collective</p>
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[186px]"
      data-name="Container"
    >
      <Container35 />
      <Container36 />
    </div>
  );
}

function Svg4() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path
            d={svgPaths.pf89c700}
            id="Vector"
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

function Button5() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg4 />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute left-0 size-[18px] top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Group">
          <path
            d={svgPaths.p3fc8b00}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p22e94980}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p1ea99a80}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p1965f000}
            id="Vector_4"
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

function Svg5() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <Group1 />
    </div>
  );
}

function Button6() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg5 />
    </div>
  );
}

function Svg6() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path
            d="M3.75 9H14.25M9 3.75V14.25"
            id="Vector"
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

function Button7() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg6 />
    </div>
  );
}

function Container38() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Button5 />
      <Button6 />
      <Button7 />
    </div>
  );
}

function Background9() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-3 py-2 relative w-full">
          <TrackCover />
          <Container37 />
          <Container38 />
        </div>
      </div>
    </div>
  );
}

function TrackCover1() {
  return (
    <div
      className="bg-[#484f58] bg-[position:0%_50%,_0%_0%] bg-size-[100%_125%,auto] rounded shrink-0 size-12"
      data-name="Track Cover"
      style={{ backgroundImage: `url('${imgTrackCover1}')` }}
    />
  );
}

function Container39() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[71.36px]">
        <p className="block leading-[normal]">City Lights</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[70.16px]">
        <p className="block leading-[normal]">Urban Beats</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[186px]"
      data-name="Container"
    >
      <Container39 />
      <Container40 />
    </div>
  );
}

function Svg7() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path
            d={svgPaths.pf89c700}
            id="Vector"
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

function Button8() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg7 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute left-0 size-[18px] top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Group">
          <path
            d={svgPaths.p3fc8b00}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p22e94980}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p1ea99a80}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p1965f000}
            id="Vector_4"
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

function Svg8() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <Group2 />
    </div>
  );
}

function Button9() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg8 />
    </div>
  );
}

function Svg9() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path
            d="M3.75 9H14.25M9 3.75V14.25"
            id="Vector"
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

function Button10() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-center p-0 relative shrink-0"
      data-name="Button"
    >
      <Svg9 />
    </div>
  );
}

function Container42() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Button8 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function Background10() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-3 py-2 relative w-full">
          <TrackCover1 />
          <Container41 />
          <Container42 />
        </div>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background9 />
      <Background10 />
    </div>
  );
}

function Heading6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-64"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-5 justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-64">
        <p className="block leading-[normal]">Challenges \ Contest</p>
      </div>
    </div>
  );
}

function Button11() {
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

function Container44() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Heading6 />
      <Button11 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p1140ee00}
            id="Vector"
            stroke="var(--stroke-0, #D29922)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p3133aedc}
            id="Vector_2"
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

function Svg10() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <Group3 />
    </div>
  );
}

function Background11() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[20px] shrink-0 size-10"
      data-name="Background"
    >
      <Svg10 />
    </div>
  );
}

function Container45() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[140px]">
        <p className="block leading-[normal]">Remix Rumble</p>
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[129px]">
        <p className="block leading-[normal]">Ends in 3 days</p>
      </div>
    </div>
  );
}

function Container47() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[164px]"
      data-name="Container"
    >
      <Container45 />
      <Container46 />
    </div>
  );
}

function Button12() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-4 py-2 relative rounded-[7px] shrink-0 w-[92px]"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center w-full">
        <p className="block leading-[normal]">Join</p>
      </div>
    </div>
  );
}

function Background12() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-4 py-3 relative w-full">
          <Background11 />
          <Container47 />
          <Button12 />
        </div>
      </div>
    </div>
  );
}

function Svg11() {
  return (
    <div className="relative shrink-0 size-6" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SVG">
          <path
            d={svgPaths.p3a0c580}
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

function Background13() {
  return (
    <div
      className="bg-[#ff4400] box-border content-stretch flex flex-row items-center justify-center p-0 relative rounded-[20px] shrink-0 size-10"
      data-name="Background"
    >
      <Svg11 />
    </div>
  );
}

function Container48() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-[165px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#c9d1d9] text-[14px] text-left w-[196px]">
        <p className="block leading-[normal]">Tempo Master</p>
      </div>
    </div>
  );
}

function Container49() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-[165px]"
      data-name="Container"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[#8b949e] text-[12px] text-left w-[165px]">
        <p className="block leading-[normal]">New challenge!</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-[165px]"
      data-name="Container"
    >
      <Container48 />
      <Container49 />
    </div>
  );
}

function Button13() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-4 py-2 relative rounded-[7px] shrink-0 w-[91px]"
      data-name="Button"
    >
      <div className="flex flex-col font-['Montserrat:SemiBold',_sans-serif] font-semibold h-[17px] justify-center leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center w-full">
        <p className="block leading-[normal]">Join</p>
      </div>
    </div>
  );
}

function Background14() {
  return (
    <div className="bg-[#161b22] relative rounded-lg shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-center justify-start px-4 py-3 relative w-full">
          <Background13 />
          <Container50 />
          <Button13 />
        </div>
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background12 />
      <Background14 />
    </div>
  );
}

function Heading1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 1"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[normal] not-italic relative shrink-0 text-[#c9d1d9] text-[20px] text-left w-[257.61px]">
        <p className="block mb-0">{`Explore Remixes & Join the`}</p>
        <p className="block">Conversation</p>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute left-0 size-[18px] top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Group">
          <path
            d="M15.75 15.75L12.495 12.495"
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d={svgPaths.p2c275980}
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

function Svg12() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <Group4 />
    </div>
  );
}

function IconifyIcon2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg12 />
    </div>
  );
}

function Container52() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[14px] text-left w-[162.75px]">
        <p className="block leading-[normal]">Search remixes, artists...</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start overflow-clip px-0.5 py-px relative shrink-0 w-[260px]"
      data-name="Input"
    >
      <Container52 />
    </div>
  );
}

function Background15() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-row gap-2 items-center justify-start px-3 py-2 relative rounded-lg shrink-0 w-[310px]"
      data-name="Background"
    >
      <IconifyIcon2 />
      <Input />
    </div>
  );
}

function Svg13() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path
            d={svgPaths.p1c613720}
            id="Vector"
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

function Button14() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-row items-center justify-center p-[8px] relative rounded-[6.67px] shrink-0"
      data-name="Button"
    >
      <Svg13 />
    </div>
  );
}

function Container53() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background15 />
      <Button14 />
    </div>
  );
}

function Button15() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-center justify-center px-3 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12px] text-center w-[62.67px]">
        <p className="block leading-[normal]">Most Liked</p>
      </div>
    </div>
  );
}

function Button16() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-center justify-center px-3 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[70.44px]">
        <p className="block leading-[normal]">Most Played</p>
      </div>
    </div>
  );
}

function Button17() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-center justify-center px-3 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[50.94px]">
        <p className="block leading-[normal]">Trending</p>
      </div>
    </div>
  );
}

function Button18() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-center justify-center px-3 py-2 relative rounded-md shrink-0"
      data-name="Button"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[43.28px]">
        <p className="block leading-[normal]">Newest</p>
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
      <Button15 />
      <Button16 />
      <Button17 />
      <Button18 />
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-4 pl-0 pr-6 pt-6 relative w-full">
          <Heading1 />
          <Container53 />
          <Container54 />
        </div>
      </div>
    </div>
  );
}

function Heading7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[215.28px]">
        <p className="block leading-[normal]">Featured Remix Spotlight</p>
      </div>
    </div>
  );
}

function FeaturedRemixCover() {
  return (
    <div
      className="absolute bg-left bg-no-repeat bg-size-[100%_117.33%] inset-0"
      data-name="Featured Remix Cover"
      style={{ backgroundImage: `url('${imgFeaturedRemixCover}')` }}
    />
  );
}

function Container56() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[18px] text-left w-[208.89px]">
        <p className="block leading-[normal]">Galactic Groove (Remix)</p>
      </div>
    </div>
  );
}

function Container57() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-[rgba(255,255,255,0.7)] text-left w-[250.33px]">
        <p className="block leading-[normal]">Original by: StarDust • Remixed by: DJ Echo</p>
      </div>
    </div>
  );
}

function Container58() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container56 />
      <Container57 />
    </div>
  );
}

function Svg14() {
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

function Button19() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-row items-center justify-center px-1.5 py-px relative rounded-3xl shrink-0 size-12"
      data-name="Button"
    >
      <Svg14 />
    </div>
  );
}

function Svg15() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p863ae00}
            id="Vector"
            stroke="var(--stroke-0, white)"
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
      <Svg15 />
    </div>
  );
}

function Container59() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon3 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-left w-[27.67px]">
        <p className="block leading-[normal]">1.2K</p>
      </div>
    </div>
  );
}

function Svg16() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p378a2380}
            id="Vector"
            stroke="var(--stroke-0, white)"
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
      <Svg16 />
    </div>
  );
}

function Container60() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon4 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-left w-[17.34px]">
        <p className="block leading-[normal]">89</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute left-0 size-3.5 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path
            d={svgPaths.p34fd4720}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p1c4ff500}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p1281b180}
            id="Vector_3"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.pce97200}
            id="Vector_4"
            stroke="var(--stroke-0, white)"
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
      <Group5 />
    </div>
  );
}

function IconifyIcon5() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg17 />
    </div>
  );
}

function Container61() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon5 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[rgba(255,255,255,0.8)] text-left w-[23.08px]">
        <p className="block leading-[normal]">210</p>
      </div>
    </div>
  );
}

function Container62() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <Container59 />
      <Container60 />
      <Container61 />
    </div>
  );
}

function Container63() {
  return (
    <div
      className="box-border content-stretch flex flex-row items-center justify-between p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button19 />
      <Container62 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p3479c980}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p3d9bdc00}
            id="Vector_2"
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

function Svg18() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Group6 />
    </div>
  );
}

function Button20() {
  return (
    <div className="bg-[#ff22fb] relative rounded-[7px] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2.5 relative w-full">
          <Svg18 />
          <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[17px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center w-[106.58px]">
            <p className="block leading-[normal]">Remix this track</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Container64() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-3 items-start justify-start p-[16px] relative w-full">
          <Container58 />
          <Container63 />
          <Button20 />
        </div>
      </div>
    </div>
  );
}

function Background16() {
  return (
    <div
      className="bg-[#484f58] box-border content-stretch flex flex-col h-[200px] items-start justify-end overflow-clip p-0 relative rounded-2xl shrink-0 w-full"
      data-name="Background"
    >
      <FeaturedRemixCover />
      <div className="absolute bg-gradient-to-t from-[#000000cc] inset-0 to-50% to-[#00000000]" data-name="Gradient" />
      <Container64 />
    </div>
  );
}

function Container65() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pl-0 pr-6 pt-[14.94px] relative shrink-0 w-[376px]"
      data-name="Container"
    >
      <Heading7 />
      <Background16 />
    </div>
  );
}

function Margin() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-6 pt-0 px-0 relative shrink-0 w-[376px]"
      data-name="Margin"
    >
      <Container65 />
    </div>
  );
}

function Heading8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Heading 2"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[18px] text-left w-[176.55px]">
        <p className="block leading-[normal]">Community Remixes</p>
      </div>
    </div>
  );
}

function RemixCover() {
  return (
    <div
      className="bg-[#484f58] bg-[position:0%_50%,_0%_0%] bg-size-[100%_150%,auto] rounded-lg shrink-0 size-20"
      data-name="Remix Cover"
      style={{ backgroundImage: `url('${imgRemixCover}')` }}
    />
  );
}

function Container66() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[176.53px]">
        <p className="block leading-[normal]">Cosmic Drift (Chill Mix)</p>
      </div>
    </div>
  );
}

function RemixerAvatar() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[10px] shrink-0 size-5"
      data-name="Remixer Avatar"
      style={{ backgroundImage: `url('${imgRemixerAvatar}')` }}
    />
  );
}

function Container67() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[82.11px]">
        <p className="block leading-[normal]">by BeatMaster</p>
      </div>
    </div>
  );
}

function Container68() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <RemixerAvatar />
      <Container67 />
    </div>
  );
}

function Container69() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container66 />
      <Container68 />
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

function Svg19() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group7 />
    </div>
  );
}

function IconifyIcon6() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg19 />
    </div>
  );
}

function Container70() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[73.11px]">
        <p className="block leading-[normal]">Play Preview</p>
      </div>
    </div>
  );
}

function Background17() {
  return (
    <div className="bg-[#161b22] relative rounded-md shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-2.5 py-1.5 relative w-full">
          <IconifyIcon6 />
          <Container70 />
        </div>
      </div>
    </div>
  );
}

function Svg20() {
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

function IconifyIcon7() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg20 />
    </div>
  );
}

function Container71() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon7 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[22.3px]">
        <p className="block leading-[normal]">543</p>
      </div>
    </div>
  );
}

function Group8() {
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

function Svg21() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group8 />
    </div>
  );
}

function IconifyIcon8() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg21 />
    </div>
  );
}

function Container72() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon8 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[30.81px]">
        <p className="block leading-[normal]">12.3K</p>
      </div>
    </div>
  );
}

function Svg22() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p1fa08bc0}
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

function IconifyIcon9() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg22 />
    </div>
  );
}

function Container73() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon9 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[14.22px]">
        <p className="block leading-[normal]">87</p>
      </div>
    </div>
  );
}

function Svg23() {
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

function IconifyIcon10() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg23 />
    </div>
  );
}

function Container74() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon10 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[14.73px]">
        <p className="block leading-[normal]">32</p>
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container71 />
      <Container72 />
      <Container73 />
      <Container74 />
    </div>
  );
}

function Background18() {
  return (
    <div
      className="absolute bg-[#161b22] bottom-[26px] box-border content-stretch flex flex-col items-start justify-start left-0 px-2 py-1 rounded-[5px] top-0"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[10px] text-left tracking-[0.5px] uppercase w-[68.36px]">
        <p className="adjustLetterSpacing block leading-[normal]">ELECTRONIC</p>
      </div>
    </div>
  );
}

function Background19() {
  return (
    <div
      className="absolute bg-[#161b22] bottom-[26px] box-border content-stretch flex flex-col items-start justify-start left-[90.36px] px-2 py-1 rounded-[5px] top-0"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[10px] text-left tracking-[0.5px] uppercase w-[31.33px]">
        <p className="adjustLetterSpacing block leading-[normal]">CHILL</p>
      </div>
    </div>
  );
}

function Background20() {
  return (
    <div
      className="absolute bg-[#d29922] bottom-0 box-border content-stretch flex flex-col items-start justify-start left-0 px-2 py-1 rounded-[5px] top-[26px]"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[10px] text-left tracking-[0.5px] uppercase w-[85.44px]">
        <p className="adjustLetterSpacing block leading-[normal]">TRENDING NOW</p>
      </div>
    </div>
  );
}

function Container76() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Container">
      <Background18 />
      <Background19 />
      <Background20 />
    </div>
  );
}

function Svg24() {
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

function Button21() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon11 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[23.3px]">
        <p className="block leading-[normal]">Like</p>
      </div>
    </div>
  );
}

function Svg25() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p22d0e180}
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

function Button22() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon12 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[55.72px]">
        <p className="block leading-[normal]">Comment</p>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p55a2380}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p146ab300}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p271aad00}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p14eae880}
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

function Svg26() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Group9 />
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

function Button23() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon13 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[33.25px]">
        <p className="block leading-[normal]">Share</p>
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button21 />
      <Button22 />
      <Button23 />
    </div>
  );
}

function Margin1() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container77 />
    </div>
  );
}

function Container78() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative self-stretch shrink-0 w-[234px]"
      data-name="Container"
    >
      <Container69 />
      <Background17 />
      <Container75 />
      <Container76 />
      <Margin1 />
    </div>
  );
}

function BackgroundBorder() {
  return (
    <div className="bg-[#161b22] relative rounded-2xl shrink-0 w-full" data-name="Background+Border">
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-2xl"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-[13px] relative w-full">
          <RemixCover />
          <Container78 />
        </div>
      </div>
    </div>
  );
}

function RemixCover1() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[150%_100%,auto] rounded-lg shrink-0 size-20"
      data-name="Remix Cover"
      style={{ backgroundImage: `url('${imgRemixCover1}')` }}
    />
  );
}

function Container79() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[217.72px]">
        <p className="block leading-[normal]">City Lights (Vaporwave Edit)</p>
      </div>
    </div>
  );
}

function RemixerAvatar1() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[10px] shrink-0 size-5"
      data-name="Remixer Avatar"
      style={{ backgroundImage: `url('${imgRemixerAvatar1}')` }}
    />
  );
}

function Container80() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[98.66px]">
        <p className="block leading-[normal]">by SynthDreamer</p>
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <RemixerAvatar1 />
      <Container80 />
    </div>
  );
}

function Container82() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container79 />
      <Container81 />
    </div>
  );
}

function Group10() {
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

function Svg27() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group10 />
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

function Container83() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[73.11px]">
        <p className="block leading-[normal]">Play Preview</p>
      </div>
    </div>
  );
}

function Background21() {
  return (
    <div className="bg-[#161b22] relative rounded-md shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-2.5 py-1.5 relative w-full">
          <IconifyIcon14 />
          <Container83 />
        </div>
      </div>
    </div>
  );
}

function Svg28() {
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

function Container84() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon15 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[22.28px]">
        <p className="block leading-[normal]">389</p>
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

function Svg29() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group11 />
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

function Container85() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon16 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[22.53px]">
        <p className="block leading-[normal]">8.1K</p>
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
            d={svgPaths.p1fa08bc0}
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

function Container86() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon17 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[14.56px]">
        <p className="block leading-[normal]">65</p>
      </div>
    </div>
  );
}

function Svg31() {
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

function Container87() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon18 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[14.89px]">
        <p className="block leading-[normal]">20</p>
      </div>
    </div>
  );
}

function Container88() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container84 />
      <Container85 />
      <Container86 />
      <Container87 />
    </div>
  );
}

function Background22() {
  return (
    <div
      className="absolute bg-[#161b22] bottom-[26px] box-border content-stretch flex flex-col items-start justify-start left-0 px-2 py-1 rounded-[5px] top-0"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[10px] text-left tracking-[0.5px] uppercase w-[67.44px]">
        <p className="adjustLetterSpacing block leading-[normal]">VAPORWAVE</p>
      </div>
    </div>
  );
}

function Background23() {
  return (
    <div
      className="absolute bg-[#161b22] bottom-[26px] box-border content-stretch flex flex-col items-start justify-start left-[89.44px] px-2 py-1 rounded-[5px] top-0"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[10px] text-left tracking-[0.5px] uppercase w-[45.91px]">
        <p className="adjustLetterSpacing block leading-[normal]">DREAMY</p>
      </div>
    </div>
  );
}

function Background24() {
  return (
    <div
      className="absolute bg-[#2ea043] bottom-0 box-border content-stretch flex flex-col items-start justify-start left-0 px-2 py-1 rounded-[5px] top-[26px]"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[10px] text-left tracking-[0.5px] uppercase w-[75.52px]">
        <p className="adjustLetterSpacing block leading-[normal]">NEW RELEASE</p>
      </div>
    </div>
  );
}

function Container89() {
  return (
    <div className="h-[46px] relative shrink-0 w-full" data-name="Container">
      <Background22 />
      <Background23 />
      <Background24 />
    </div>
  );
}

function Svg32() {
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

function Button24() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon19 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[23.3px]">
        <p className="block leading-[normal]">Like</p>
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
            d={svgPaths.p22d0e180}
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

function Button25() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon20 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[55.72px]">
        <p className="block leading-[normal]">Comment</p>
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p55a2380}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p146ab300}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p271aad00}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p14eae880}
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

function Svg34() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Group12 />
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

function Button26() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon21 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[33.25px]">
        <p className="block leading-[normal]">Share</p>
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button24 />
      <Button25 />
      <Button26 />
    </div>
  );
}

function Margin2() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container90 />
    </div>
  );
}

function Container91() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative self-stretch shrink-0 w-[234px]"
      data-name="Container"
    >
      <Container82 />
      <Background21 />
      <Container88 />
      <Container89 />
      <Margin2 />
    </div>
  );
}

function BackgroundBorder1() {
  return (
    <div className="bg-[#161b22] relative rounded-2xl shrink-0 w-full" data-name="Background+Border">
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-2xl"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-[13px] relative w-full">
          <RemixCover1 />
          <Container91 />
        </div>
      </div>
    </div>
  );
}

function RemixCover2() {
  return (
    <div
      className="bg-[#484f58] bg-[position:50%_0%,_0%_0%] bg-size-[133.17%_100%,auto] rounded-lg shrink-0 size-20"
      data-name="Remix Cover"
      style={{ backgroundImage: `url('${imgRemixCover2}')` }}
    />
  );
}

function Container92() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#c9d1d9] text-[16px] text-left w-[170.22px]">
        <p className="block leading-[normal]">Neon Pulse (Club Mix)</p>
      </div>
    </div>
  );
}

function RemixerAvatar2() {
  return (
    <div
      className="bg-no-repeat bg-size-[100%_100%] bg-top-left rounded-[10px] shrink-0 size-5"
      data-name="Remixer Avatar"
      style={{ backgroundImage: `url('${imgRemixerAvatar2}')` }}
    />
  );
}

function Container93() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[85.83px]">
        <p className="block leading-[normal]">by GrooveGuru</p>
      </div>
    </div>
  );
}

function Container94() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <RemixerAvatar2 />
      <Container93 />
    </div>
  );
}

function Container95() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container92 />
      <Container94 />
    </div>
  );
}

function Group13() {
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

function Svg35() {
  return (
    <div className="relative shrink-0 size-5" data-name="SVG">
      <Group13 />
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

function Container96() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[73.11px]">
        <p className="block leading-[normal]">Play Preview</p>
      </div>
    </div>
  );
}

function Background25() {
  return (
    <div className="bg-[#161b22] relative rounded-md shrink-0 w-full" data-name="Background">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start px-2.5 py-1.5 relative w-full">
          <IconifyIcon22 />
          <Container96 />
        </div>
      </div>
    </div>
  );
}

function Svg36() {
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

function IconifyIcon23() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg36 />
    </div>
  );
}

function Container97() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon23 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[21.63px]">
        <p className="block leading-[normal]">780</p>
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

function Svg37() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <Group14 />
    </div>
  );
}

function IconifyIcon24() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg37 />
    </div>
  );
}

function Container98() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon24 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[32.78px]">
        <p className="block leading-[normal]">25.6K</p>
      </div>
    </div>
  );
}

function Svg38() {
  return (
    <div className="relative shrink-0 size-3.5" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="SVG">
          <path
            d={svgPaths.p1fa08bc0}
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

function IconifyIcon25() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg38 />
    </div>
  );
}

function Container99() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon25 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[17.09px]">
        <p className="block leading-[normal]">112</p>
      </div>
    </div>
  );
}

function Svg39() {
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

function IconifyIcon26() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg39 />
    </div>
  );
}

function Container100() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon26 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[14.88px]">
        <p className="block leading-[normal]">45</p>
      </div>
    </div>
  );
}

function Container101() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container97 />
      <Container98 />
      <Container99 />
      <Container100 />
    </div>
  );
}

function Background26() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-start justify-start px-2 py-1 relative rounded-[5px] self-stretch shrink-0"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[10px] text-left tracking-[0.5px] uppercase w-[37.52px]">
        <p className="adjustLetterSpacing block leading-[normal]">HOUSE</p>
      </div>
    </div>
  );
}

function Background27() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col items-start justify-start px-2 py-1 relative rounded-[5px] self-stretch shrink-0"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[10px] text-left tracking-[0.5px] uppercase w-[60.7px]">
        <p className="adjustLetterSpacing block leading-[normal]">ENERGETIC</p>
      </div>
    </div>
  );
}

function Background28() {
  return (
    <div
      className="bg-[#ff22fb] box-border content-stretch flex flex-col items-start justify-start px-2 py-1 relative rounded-[5px] self-stretch shrink-0"
      data-name="Background"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-3 justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[10px] text-left tracking-[0.5px] uppercase w-[58.84px]">
        <p className="adjustLetterSpacing block leading-[normal]">TOP REMIX</p>
      </div>
    </div>
  );
}

function Container102() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Background26 />
      <Background27 />
      <Background28 />
    </div>
  );
}

function Svg40() {
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

function IconifyIcon27() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg40 />
    </div>
  );
}

function Button27() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon27 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[23.3px]">
        <p className="block leading-[normal]">Like</p>
      </div>
    </div>
  );
}

function Svg41() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="SVG">
          <path
            d={svgPaths.p22d0e180}
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

function IconifyIcon28() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg41 />
    </div>
  );
}

function Button28() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon28 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[55.72px]">
        <p className="block leading-[normal]">Comment</p>
      </div>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute left-0 size-4 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Group">
          <path
            d={svgPaths.p55a2380}
            id="Vector"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p146ab300}
            id="Vector_2"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p271aad00}
            id="Vector_3"
            stroke="var(--stroke-0, #8B949E)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.33333"
          />
          <path
            d={svgPaths.p14eae880}
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

function Svg42() {
  return (
    <div className="relative shrink-0 size-4" data-name="SVG">
      <Group15 />
    </div>
  );
}

function IconifyIcon29() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg42 />
    </div>
  );
}

function Button29() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-1 items-center justify-start p-0 relative shrink-0"
      data-name="Button"
    >
      <IconifyIcon29 />
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-center w-[33.25px]">
        <p className="block leading-[normal]">Share</p>
      </div>
    </div>
  );
}

function Container103() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Button27 />
      <Button28 />
      <Button29 />
    </div>
  );
}

function Margin3() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-0 pt-1 px-0 relative shrink-0 w-full"
      data-name="Margin"
    >
      <Container103 />
    </div>
  );
}

function Container104() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative self-stretch shrink-0 w-[234px]"
      data-name="Container"
    >
      <Container95 />
      <Background25 />
      <Container101 />
      <Container102 />
      <Margin3 />
    </div>
  );
}

function BackgroundBorder2() {
  return (
    <div className="bg-[#161b22] relative rounded-2xl shrink-0 w-full" data-name="Background+Border">
      <div
        aria-hidden="true"
        className="absolute border border-[#30363d] border-solid inset-0 pointer-events-none rounded-2xl"
      />
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-row gap-3 items-start justify-start p-[13px] relative w-full">
          <RemixCover2 />
          <Container104 />
        </div>
      </div>
    </div>
  );
}

function Container105() {
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

function Container106() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-4 items-start justify-start pb-0 pl-0 pr-6 pt-[14.94px] relative shrink-0 w-[376px]"
      data-name="Container"
    >
      <Heading8 />
      <Container105 />
    </div>
  );
}

function Margin4() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start pb-6 pt-0 px-0 relative shrink-0 w-[376px]"
      data-name="Margin"
    >
      <Container106 />
    </div>
  );
}

function Container107() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-6 items-start justify-start p-0 relative shrink-0 w-full"
      data-name="Container"
    >
      <Container7 />
      <Container17 />
      <Container18 />
      <Container25 />
      <Container26 />
      <Container33 />
      <Container34 />
      <Container43 />
      <Container44 />
      <Container51 />
      <Container55 />
      <Margin />
      <Margin4 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute left-0 size-6 top-0" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Group">
          <path
            d={svgPaths.p2ba516aa}
            id="Vector"
            stroke="var(--stroke-0, #FF22FB)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d={svgPaths.p2a458f60}
            id="Vector_2"
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
      <Group16 />
    </div>
  );
}

function IconifyIcon30() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg43 />
    </div>
  );
}

function Container108() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[12px] text-left w-[35.72px]">
        <p className="block leading-[normal]">Player</p>
      </div>
    </div>
  );
}

function Background29() {
  return (
    <div
      className="bg-[#58a6ff] box-border content-stretch flex flex-col gap-1 items-center justify-start px-3 py-2 relative rounded-lg self-stretch shrink-0"
      data-name="Background"
    >
      <IconifyIcon30 />
      <Container108 />
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

function IconifyIcon31() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg44 />
    </div>
  );
}

function Container109() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[40.91px]">
        <p className="block leading-[normal]">Playlist</p>
      </div>
    </div>
  );
}

function Container110() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start px-3 py-2 relative rounded-lg self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon31 />
      <Container109 />
    </div>
  );
}

function Group17() {
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
      <Group17 />
    </div>
  );
}

function IconifyIcon32() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg45 />
    </div>
  );
}

function Container111() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[51.19px]">
        <p className="block leading-[normal]">Contests</p>
      </div>
    </div>
  );
}

function Container112() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start px-3 py-2 relative rounded-lg self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon32 />
      <Container111 />
    </div>
  );
}

function Group18() {
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
      <Group18 />
    </div>
  );
}

function IconifyIcon33() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-center justify-center p-0 relative shrink-0"
      data-name="iconify-icon"
    >
      <Svg46 />
    </div>
  );
}

function Container113() {
  return (
    <div
      className="box-border content-stretch flex flex-col items-start justify-start p-0 relative shrink-0"
      data-name="Container"
    >
      <div className="flex flex-col font-['Inter:Bold',_sans-serif] font-bold h-[15px] justify-center leading-[0] not-italic relative shrink-0 text-[#8b949e] text-[12px] text-left w-[37.05px]">
        <p className="block leading-[normal]">Profile</p>
      </div>
    </div>
  );
}

function Container114() {
  return (
    <div
      className="box-border content-stretch flex flex-col gap-1 items-center justify-start px-3 py-2 relative rounded-lg self-stretch shrink-0"
      data-name="Container"
    >
      <IconifyIcon33 />
      <Container113 />
    </div>
  );
}

function Background30() {
  return (
    <div
      className="absolute bg-[#0d1117] bottom-[17px] box-border content-stretch flex flex-row gap-[22.8px] items-start justify-start pl-[11.39px] pr-[11.4px] py-3 rounded-2xl translate-x-[-50%]"
      data-name="Background"
      style={{ left: "calc(50% - 0.03px)" }}
    >
      <Background29 />
      <Container110 />
      <Container112 />
      <Container114 />
    </div>
  );
}

function Background31() {
  return (
    <div
      className="bg-[#161b22] box-border content-stretch flex flex-col gap-5 h-[2712px] items-end justify-start pb-0 pt-6 px-6 relative rounded-2xl shrink-0 w-[400px]"
      data-name="Background"
    >
      <Container2 />
      <Background1 />
      <Container107 />
      <Background30 />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[#0d1117] relative size-full" data-name="Home page">
      <div className="flex flex-row justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row items-start justify-center p-[20px] relative size-full">
          <Background31 />
        </div>
      </div>
    </div>
  );
}