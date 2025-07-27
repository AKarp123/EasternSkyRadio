import { useState, useEffect, useMemo, memo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadStarsPreset } from "@tsparticles/preset-stars";
import { FullScreen, type Container } from "@tsparticles/engine";


type props = {
    children?: React.ReactNode;
}

const StarParticles = memo(({children}: props) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadStarsPreset(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container?: Container) => {
        console.log(container);
    };

    const options = useMemo(
        () => ({
            fullScreen: {
                enable: true,
                zIndex: -1,
            },
            background: {
                color: {
                    value: "#000",
                },
            },
            preset: "stars",
            fpsLimit: 16,
            pauseOnBlur: true,
        }),
        []
    );
    if (init) {
        return (
            <>
                <Particles
                    id="tsparticles"
                    options={options}
                    particlesLoaded={particlesLoaded}
                />
                {children}
            </>
        );
    }

    return <>{children}</>;
});

export default StarParticles;
