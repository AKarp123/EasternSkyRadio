import { useState, useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { loadStarsPreset } from "@tsparticles/preset-stars";
import { FullScreen } from "@tsparticles/engine";

const StarParticles = ({children}) => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadStarsPreset(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };

    const options = useMemo(
        () => ({
            preset: "stars",
            fullScreen: {
                enable: true,
                zIndex: -10,
            },
            background: {
                color: {
                    value: "#000",
                },
            },
        }),
        []
    );
    if (init) {
        return (
            <Particles
                id="tsparticles"
                options={options}
                particlesLoaded={particlesLoaded}
            >
                {children}
            </Particles>
        );
    }

    return <>{children}</>;
};

export default StarParticles;
