import * as Tone from 'tone';

class SoundManager {
  private isStarted = false;
  private jumpSynth: Tone.Synth | null = null;
  private crashSynth: Tone.NoiseSynth | null = null;
  private powerupSynth: Tone.FMSynth | null = null;
  private bgmPlayer: Tone.Player | null = null;
  private bgmLoop: Tone.Loop | null = null;

  public async startAudio() {
    if (this.isStarted || Tone.context.state === 'running') return;
    try {
      await Tone.start();
      this.initSynths();
      this.isStarted = true;
      console.log('Audio context started');
    } catch (e) {
      console.error("Could not start audio context", e);
    }
  }

  private initSynths() {
    this.jumpSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 },
    }).toDestination();

    this.crashSynth = new Tone.NoiseSynth({
        noise: { type: 'brown' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 },
    }).toDestination();

    this.powerupSynth = new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.4 },
        modulationEnvelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.5 },
    }).toDestination();
    
    // Simple synth loop for BGM
    this.bgmLoop = new Tone.Loop(time => {
        this.powerupSynth?.triggerAttackRelease("C3", "8n", time);
        this.powerupSynth?.triggerAttackRelease("G3", "8n", time + 0.5);
        this.powerupSynth?.triggerAttackRelease("E3", "8n", time + 1);
    }, "1n").start(0);
    Tone.Transport.bpm.value = 120;
  }

  public playJump() {
    if (!this.isStarted) return;
    this.jumpSynth?.triggerAttackRelease('C5', '16n');
  }

  public playCrash() {
    if (!this.isStarted) return;
    this.crashSynth?.triggerAttackRelease('2n');
  }

  public playPowerup() {
    if (!this.isStarted) return;
    this.powerupSynth?.triggerAttackRelease('E6', '8n');
  }
  
  public playBGM() {
      if (!this.isStarted) this.startAudio();
      if (Tone.Transport.state !== 'started') {
        Tone.Transport.start();
      }
  }

  public stopBGM() {
      if (Tone.Transport.state === 'started') {
          Tone.Transport.stop();
      }
  }
}

export const soundManager = new SoundManager();
