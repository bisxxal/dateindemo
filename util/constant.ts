export interface TinderCardsProps {
  person: {
    name: string;
    image: string;
    id: string,
    profile: {
      job: string;
      batch: string;
      location: string;
      livingIn: string;
      lookingFor: string;
      height: string;
      bio: string;
      age: number;
      languages: { name: string }[];
      keywords: { name: string }[];
    };
    photos: {
      url: string
    }[];
  }[];

  user: {
    profile: {
      keywords: {
        name: string
      }[];
      lookingFor: string;
    }
  },
  // onRefetch: () => Promise<any>; 
}

export interface PopUpProps {
  current: {
    id: string;
    verified: boolean;
    profile: {
      job: string;
      batch: string;
      location: string;
      livingIn: string;
      lookingFor: string;
      height: number;
      bio: string;
      age: number;
      languages: string,
      keywords: { name: string }[];
    },
    name: string;
  }

  user: {
    id:true,
    profile: {
      keywords: { name: string }[];
      lookingFor: string;
    };
  }
}

export interface PopUpPropsExtended extends PopUpProps {
  displayed: boolean;
  setDisplayed: (displayed: boolean) => void;
}