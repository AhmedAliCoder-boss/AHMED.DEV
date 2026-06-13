import React from 'react'
import { motion } from 'framer-motion'
import { FaDownload } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { FaMapPin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

export default function About() {
  const skills = [
    { category: 'Frontend', items: ['React', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Next.js'] },
    { category: 'Backend', items: ['Node.js', 'Python', 'PostgreSQL', 'Supabase', 'REST APIs'] },
    { category: 'Tools', items: ['Git', 'Docker', 'AWS', 'Figma', 'VS Code'] },
  ]

  const experience = [
    {
      year: '2023 - Present',
      role: 'Senior Frontend Engineer',
      company: 'Tech Company',
      description: 'Leading frontend development for enterprise applications'
    },
    {
      year: '2021 - 2023',
      role: 'Full Stack Developer',
      company: 'Digital Agency',
      description: 'Built scalable web applications for various clients'
    },
    {
      year: '2019 - 2021',
      role: 'Junior Developer',
      company: 'Startup',
      description: 'Developed MVP products and learned modern web technologies'
    }
  ]

  return (
    <div className="pt-16 px-6 py-20 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              About Me
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm a passionate full-stack developer with a love for creating beautiful, 
              functional, and user-centered digital experiences. With 5+ years of experience 
              in web development, I specialize in building modern applications using 
              cutting-edge technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <SlCalender className="text-blue-600" size={24} />
                <span className="font-semibold text-gray-900 dark:text-white">5+ Years</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Professional Experience</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <FaGithub className="text-blue-600" size={24} />
                <span className="font-semibold text-gray-900 dark:text-white">50+ Projects</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Completed Successfully</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <FaMapPin className="text-blue-600" size={24} />
                <span className="font-semibold text-gray-900 dark:text-white">Remote</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Available Worldwide</p>
            </motion.div>
          </div>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Skills & Technologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skills.map((skillGroup, index) => (
                <motion.div
                  key={skillGroup.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Experience</h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 border-l-2 border-blue-600"
                >
                  <div className="absolute left-0 top-0 w-4 h-4 bg-blue-600 rounded-full -translate-x-1/2"></div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {exp.year}
                    </span>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">
                      {exp.role}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{exp.company}</p>
                    <p className="text-gray-700 dark:text-gray-300 mt-3">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <FaDownload />
              Download Resume
            </motion.button>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
