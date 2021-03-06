export type ResumeType = {
  userinfo: ResumeTypeUserinfo;
  selfIntroduce: string;
  educationExperience: ResumeTypeEducationExperience[];
  projects: ResumeTypeProjects[];
  jobs: ResumeTypeJobs[];
};

export type ResumeTypeJobs = {
  name: string;
  date: {
    start: string;
    end: string;
  };
  tags: { name: string; color: string }[];
  introduce: string;
};

export type ResumeTypeUserinfo = {
  avatar: string;
  nickname: string;
  intentionJob: string;
  phone: string;
  mail: string;
  qq: string;
  wechat: string;
};
export type ResumeTypeEducationExperienceDate = {
  start: string;
  end: string;
};
export type ResumeTypeEducationExperience = {
  date: ResumeTypeEducationExperienceDate;
  school: string;
  education: string;
};
export type ResumeTypeProjectsTags = {
  name: string;
  color: string;
};
export type ResumeTypeProjects = {
  name: string;
  tags: ResumeTypeProjectsTags[];
  introduce: string;
  lists: string[];
};
